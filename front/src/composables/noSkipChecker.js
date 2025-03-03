import { watch, ref, computed } from "vue";
import { useStores } from "./useStores"
import { findQuestion } from "@/utils/findQuestionInStore";
export const noSkipChecker = () => {
    const stores = useStores();
    const questions = stores.questionsStore.getQuestions;
    const noErrors = computed(() => stores.helperStore.isValid);


    watch(questions, () => {
        const conditions = (question) => {
            if (question.type == 'CheckboxType' ||
                question.inputName == 'secondEnv' ||
                question.inputName == 'additionally' ||
                question.inputName == 'trials' ||
                question.type == 'inputGroup') {
                return true;
            }
            else if (question.inputName == 'inlet_flange' ||
                question.inputName == 'outlet_flange') {
                if (findQuestion('joining_type').value !== 'Фланцевое' || question.value) {
                    return true;
                }
            }

            else if (question.type == 'oneLineType') {
                return Boolean(question.value.length &&
                    question.value[0].id &&
                    question.value[0].value &&
                    question.value[0].value !== '');
            }
            else {
                return Boolean(question.value &&
                    question.value !== "" ||
                    (Array.isArray(question.value) && question.value.length > 0))
            };
        };
        const target = ref();
        target.value = questions.find((e) => (!conditions(e)));
        if (!target.value || !noErrors.value) return;
        stores.helperStore.setErrorMessage(target.value.inputName, 'emptyValueError')
    }, { deep: true, immediate: true })
}