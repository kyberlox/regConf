<template>
    <div class="history-page__wrapper">
        <div class="history-page">
            <HistoryCalendar 
                             v-model="selectedDate"
                             :year-range="yearRange"
                             :formattedJson="formattedJson" />
            <div class="history-page__elements content-container">
                <TransitionGroup name="list">
                    <div v-for="(item, index) in formattedJson"
                         :key="'tkpNum' + item.id"
                         class="history-page__element"
                         :class="{ hidden: item.hidden }"
                         @click="handleClick('open', item)">
                        <div class="history-page__element__title">{{ item.name }}</div>
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
import { computed, onMounted, ref } from 'vue';
import HistoryCalendar from '@/components/tools/HistoryCalendar.vue';
import Api from '@/utils/Api';
import { useHistoryStore } from '@/store/history';
import { updateHistory } from '@/composables/updateHistory';
import { useRouter } from 'vue-router';

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
        const router = useRouter();

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
        const yearRange = ref([]);
        const selectedDate = ref('все время');
        const showCalendar = ref(false);

        const deleteTkp = (id) => {
            Api.delete(API_URL + '/delete_tkp/' + id)
                .then(() => updateHistory());
        }

        const downloadTkp = (id, name) => {
            Api.get(API_URL + '/upload_tkp/' + id, true)
                .then((data) => {
                    Api.post(API_URL + '/generate/', data, true, false, name)
                })
        }

        const handleClick = (type, item, index) => {
            if (type == 'delete') {
              deleteTkp(item.id);
            } else if (type == 'download') {
              downloadTkp(item.id, item.name);
            }
            else if (type == 'open') {
                router.push({ name: 'positionHistory', params: { id: item.id } });
            }
        }

        const showDropdown = () => {
            showCalendar.value = !showCalendar.value;
        }

        const dateFromDatePick = ref(null);

        const tkpJson = computed(() => historyStore.getTkpHistory);

        const formattedJson = ref([]);

        onMounted(() => {
                yearRange.value.length = 0;
                const dateArr = [];
                formattedJson.value = tkpJson.value;
                formattedJson.value.map((e) => {
                    e.hidden = false;
                    dateArr.push(Number(e.date.split('-')[2]));
                });
                yearRange.value.push(Math.min.apply(null, dateArr));
                yearRange.value.push(Math.max.apply(null, dateArr));
            
        });

        return {
            handleClick,
            showDropdown,
            showCalendar,
            dateFromDatePick,
            formattedJson,
            yearRange,
            selectedDate,
            testjson: computed(() => tkpJson),
            buttons,
            selectAllDates: () => dateFromDatePick.value = null,
        }
    }
}
</script>