<template>
    <div class="history-page__wrapper">
        <div class="history-page">
<<<<<<< HEAD
            <HistoryCalendar v-model="selectedDate"
                             :year-range="yearRange"
                             :formattedJson="formattedJson" />
=======
            <div @click.stop="showDropdown"
                 class="fixed-mark lead form-control date-mark">{{ `ТКП за ${date}` }}
                <ArrowDownIcon class="history-page__navigate-btn" />
            </div>
            <VueDatePicker v-if="showCalendar"
                           v-model="dateFromDatePick"
                           locale="ru"
                           :enable-time-picker="false"
                           inline
                           auto-apply
                           placeholder="Выберите дату"
                           :year-range="yearRange"
                           
                           range>
                <template #action-extra="{ selectAll }">
                    <span class="history-page__calendar__btn-all"
                          @click="selectAllDates"
                          title="Выбрать за все время">
                        Выбрать за все время
                    </span>
                </template>
            </VueDatePicker>
>>>>>>> f86393a2c63a1ce2b5f0e8a8dd0e395443f7fb33
            <div class="history-page__elements content-container">
                <div v-for="item in testjson"
                     :key="'tkpNum' + item.id"
                     class="history-page__element"
                     :class="{ hidden: item.hidden }"
                     @click="handleClick('open')">
                    <div class="history-page__element__title">{{ item.name }}</div>
                    <div class="history-page__element__footer">
                        <div class="history-page__element__date">{{ item.date }}</div>
                        <div class="history-page__element__btn-group">
                            <div class="history-page__element-btn">
                                <DownloadIcon @click.stop="handleClick('download')"
                                              class="history-page__element-btn-svg history-page__element-btn-svg--download" />
                                <span class="tooltipo">Скачать</span>
                            </div>
                            <div class="history-page__element-btn">
                                <EditIcon @click.stop="handleClick('edit')"
                                          class="history-page__element-btn-svg history-page__element-btn-svg--edit" />
                                <span class="tooltipo">Редактировать</span>
                            </div>
                            <div class="history-page__element-btn">
                                <DeleteIcon @click.stop="handleClick('delete')"
                                            class="history-page__element-btn-svg history-page__element-btn-svg--delete" />
                                <span class="tooltipo">Удалить</span>
                            </div>
                        </div>
                    </div>
                </div>
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

export default {
    components: {
        DownloadIcon,
        EditIcon,
        DeleteIcon,
        HistoryCalendar
    },
    setup() {
        const yearRange = ref([]);
        const selectedDate = ref('все время');
        const historyStore = useHistoryStore();

        const history = ref([]);
        const showCalendar = ref(false);
        const handleClick = (type) => {
            console.log(type);
        }

        const showDropdown = () => {
            showCalendar.value = !showCalendar.value;
        }

        const dateFromDatePick = ref(null);

        const testjson = computed(() => historyStore.getTkpHistory);

        const formattedJson = ref([]);

        onMounted(() => {
            yearRange.value.length = 0;
            const dateArr = [];
            formattedJson.value = testjson.value;
            formattedJson.value.map((e) => {
                e.hidden = false;
                dateArr.push(Number(e.date.split('-')[2]));
            });
            yearRange.value.push(Math.min.apply(null, dateArr));
            yearRange.value.push(Math.max.apply(null, dateArr));
        });

        return {
            history,
            handleClick,
            showDropdown,
            showCalendar,
            dateFromDatePick,
            formattedJson,
            yearRange,
            selectedDate,
            testjson,
            selectAllDates: () => dateFromDatePick.value = null,
        }
    }
}
</script>