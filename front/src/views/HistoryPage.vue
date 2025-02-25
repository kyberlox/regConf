<template>
    <div class="history-page__wrapper">
        <div class="history-page">
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
import ArrowDownIcon from '@/assets/icons/ArrowDownIcon.vue';
import DeleteIcon from '@/assets/icons/DeleteIcon.vue';
import DownloadIcon from '@/assets/icons/DownloadIcon.vue';
import EditIcon from '@/assets/icons/EditIcon.vue';
import { compareDate } from '@/utils/compareDates';
import { computed, onMounted, ref } from 'vue';
export default {
    components: {
        DownloadIcon,
        EditIcon,
        DeleteIcon,
        ArrowDownIcon
    },
    setup() {
        const history = ref([]);
        const showCalendar = ref(false);
        const handleClick = (type) => {
            console.log(type);
        }

        const showDropdown = () => {
            showCalendar.value = !showCalendar.value;
        }

        const dateFromDatePick = ref(null);
        const date = computed(() => format(dateFromDatePick.value));

        const dateForSort = ref();

        const resort = (showAll) => {
            if (showAll) {
                formattedJson.value.map((e) => {
                    e.hidden = false;
                })
            } else {
                formattedJson.value.map((e) => {
                    if (Array.isArray(dateForSort.value)) {
                        if (compareDate(e.date, dateForSort.value[0], 'bigger') && compareDate(e.date, dateForSort.value[1], 'smaller')) {
                            e.hidden = false;
                        } else {
                            e.hidden = true;
                        }
                    } else {
                        String(e.date) == String(dateForSort.value) ? e.hidden = false : e.hidden = true;
                    }
                })
            }
        }

        const format = (datePicked) => {
            const formattedDate = ref();
            if (datePicked) {
                if (String(datePicked[0]) == String(datePicked[1])) {
                    const day = datePicked[0].getDate();
                    const month = datePicked[0].getMonth() + 1;
                    const year = datePicked[0].getFullYear();
                    formattedDate.value = `${day > 9 ? day : "0" + day}.${month > 9 ? month : "0" + month}.${year}`;
                    dateForSort.value = formattedDate.value;
                }
                else if (!datePicked[1]) {
                    const day = datePicked[0].getDate();
                    const month = datePicked[0].getMonth() + 1;
                    const year = datePicked[0].getFullYear();
                    formattedDate.value = `${day > 9 ? day : "0" + day}.${month > 9 ? month : "0" + month}.${year}`;
                    dateForSort.value = formattedDate.value;
                }
                else {
                    formattedDate.value = datePicked.map(e => {
                        const day = e.getDate();
                        const month = e.getMonth() + 1;
                        const year = e.getFullYear();
                        return e = `${day > 9 ? day : "0" + day}.${month > 9 ? month : "0" + month}.${year}`;
                    });
                    dateForSort.value = formattedDate.value;
                    formattedDate.value = formattedDate.value.join('-');
                }
                resort(false);
                return formattedDate.value;
            }
            else {
                resort(true);
                dateForSort.value = null;
                return "все время";
            };
        }

        const testjson = [
            {
                id: 1,
                name: 'ТКП АБОБУС',
                date: '19.02.2025',
            },
            {
                id: 2,
                name: 'ТКП АБОБУС2',
                date: '01.02.2025',
            },
            {
                id: 3,
                name: 'ТКП АБОБУС3',
                date: '10.03.2025',
            },
            {
                id: 4,
                name: 'ТКП АБОБУС4',
                date: '10.03.2022',
            },
        ];

        const formattedJson = ref([]);

        const yearRange = ref([]);

        onMounted(() => {
            yearRange.value.length = 0;
            const dateArr = [];
            formattedJson.value = testjson;
            formattedJson.value.map((e) => {
                e.hidden = false;
                dateArr.push(Number(e.date.split('.')[2]));
            });
            yearRange.value.push(Math.min.apply(null, dateArr));
            yearRange.value.push(Math.max.apply(null, dateArr));
        })

        return {
            history,
            handleClick,
            showDropdown,
            showCalendar,
            dateFromDatePick,
            date,
            testjson,
            yearRange,
            selectAllDates: () => dateFromDatePick.value = null,
        }
    }
}
</script>