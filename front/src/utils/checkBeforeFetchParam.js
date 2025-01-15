import { computed, watch } from "vue";

export const checkBeforeFetchParam = (paramToWatch, answersArray, callback, arrayTarget) => {
    const watchedValues = computed(() => {
        return paramToWatch.map(key => answersArray.value[key]);
    });
    watch(watchedValues, (newVal, oldVal) => {
        if (newVal.every(val => val !== undefined) && newVal.some((val, index) => val !== oldVal[index])) {
            callback(arrayTarget);
        }
    });
}