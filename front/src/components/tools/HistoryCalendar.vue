<template>
    <div class="history-calendar">
        <div @click.stop="showDropdown"
             class="fixed-mark lead form-control date-mark">
            {{ `ТКП за ${date}` }}
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
            <template #action-extra>
                <span class="history-page__calendar__btn-all"
                      @click="selectAllDates"
                      title="Выбрать за все время">
                    Выбрать за все время
                </span>
            </template>
        </VueDatePicker>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import ArrowDownIcon from '@/assets/icons/ArrowDownIcon.vue';
import { compareDate } from '@/utils/compareDates';

export default {
    name: 'HistoryCalendar',
    components: {
        ArrowDownIcon
    },
    props: {
        yearRange: {
            type: Array,
            required: true
        },
        formattedJson: {
            type: Array,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const showCalendar = ref(false);
        const dateFromDatePick = ref(null);
        const dateForSort = ref();

        const showDropdown = () => {
            showCalendar.value = !showCalendar.value;
        };

        const resort = (showAll) => {
            if (showAll) {
                props.formattedJson.map((e) => {
                    e.hidden = false;
                });
            } else {
                props.formattedJson.map((e) => {
                    if (Array.isArray(dateForSort.value)) {
                        if (compareDate(e.date, dateForSort.value[0], 'bigger') &&
                            compareDate(e.date, dateForSort.value[1], 'smaller')) {
                            e.hidden = false;
                        } else {
                            e.hidden = true;
                        }
                    } else {
                        String(e.date) == String(dateForSort.value) ? e.hidden = false : e.hidden = true;
                    }
                });
            }
        };

        const format = (datePicked) => {
            const formattedDate = ref();
            if (datePicked) {
                if (String(datePicked[0]) == String(datePicked[1])) {
                    const day = datePicked[0].getDate();
                    const month = datePicked[0].getMonth() + 1;
                    const year = datePicked[0].getFullYear();
                    formattedDate.value = `${day > 9 ? day : "0" + day}-${month > 9 ? month : "0" + month}-${year}`;
                    dateForSort.value = formattedDate.value;
                }
                else if (!datePicked[1]) {
                    const day = datePicked[0].getDate();
                    const month = datePicked[0].getMonth() + 1;
                    const year = datePicked[0].getFullYear();
                    formattedDate.value = `${day > 9 ? day : "0" + day}-${month > 9 ? month : "0" + month}-${year}`;
                    dateForSort.value = formattedDate.value;
                }
                else {
                    formattedDate.value = datePicked.map(e => {
                        const day = e.getDate();
                        const month = e.getMonth() + 1;
                        const year = e.getFullYear();
                        return `${day > 9 ? day : "0" + day}-${month > 9 ? month : "0" + month}-${year}`;
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
            }
        };

        const date = computed(() => {
            const formattedDate = format(dateFromDatePick.value);
            emit('update:modelValue', formattedDate);
            return formattedDate;
        });

        const selectAllDates = () => {
            dateFromDatePick.value = null;
        };

        return {
            showCalendar,
            dateFromDatePick,
            showDropdown,
            date,
            selectAllDates
        };
    }
}
</script>
