<template>
    <div class="history-page__wrapper">
        <div class="history-page">
            <div class="history-page__elements content-container">
                <TransitionGroup name="list">
                    <div v-for="(item, index) in formattedJson"
                         :key="'tkpNum' + item.id"
                         class="history-page__element"
                         :class="{ hidden: item.hidden }"
                         @click="handleClick('open', item)">
                        <div class="history-page__element__title">{{item.mark}}</div>
                        <div class="history-page__element__footer">
                            <div
                                 class="history-page__element__date">{{ item.date }}</div>
                            <div class="history-page__element__btn-group">
                                <div class="history-page__element-btn"
                                     v-for="button in buttons"
                                     :key="'btn' + button.name">
                                    <component :is="button.icon"
                                               @click.stop="handleClick(button.name, item, index)"
                                               :class="`history-page__element-btn-svg history-page__element-btn-svg--${button.name}`" />
                                    <span class="tooltipo">{{ button.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script>
import DeleteIcon from '@/assets/icons/DeleteIcon.vue';
import DownloadIcon from '@/assets/icons/DownloadIcon.vue';
import EditIcon from '@/assets/icons/EditIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import HistoryCalendar from '@/components/tools/HistoryCalendar.vue';
import Api from '@/utils/Api';
import { useHistoryStore } from '@/store/history';
import { updateHistory } from '@/composables/updateHistory';
import { useRoute, useRouter } from 'vue-router';

export default {
    components: {
        DownloadIcon,
        EditIcon,
        DeleteIcon,
        HistoryCalendar
    },
    emits: ['updateHistory'],
    setup(props, { emit }) {
        const historyStore = useHistoryStore();
        const route = useRoute();

        const buttons = [
            {
                title: 'Скачать',
                name: 'download',
                icon: DownloadIcon
            },
            {
                title: 'Удалить',
                name: 'delete',
                icon: DeleteIcon
            },
        ]

        const downloadOl = (data) => {
            Api.post(API_URL + '/makeOL', data, true, true, "Опросный лист " + data.mark)
        }

        const deleteOl = (id) => {
            Api.delete(API_URL + '/delete_position_tkp/' + route.params.id + '/' + id)
                .then(() => {
                    updateHistory();
                    initPosHistory()
                });
        }

        const handleClick = (type, item, index) => {
            if (type == 'delete') {
           deleteOl(index);
            } else if (type == 'download') {
                downloadOl(item);
            }
        }

        const posJson = computed(() => historyStore.getTkpPosHistory);

        const formattedJson = ref([]);

        const initPosHistory = () => {
            Api.get(API_URL + '/upload_tkp/' + route.params.id, true)
                .then((data) => {
                    historyStore.setTkpPosHistory(data);
                    formattedJson.value = posJson.value;
                })
        }

        onMounted(() => {
            initPosHistory();
        });

        return {
            handleClick,
            formattedJson,
            testjson: computed(() => posJson),
            buttons,
        }
    }
}
</script>