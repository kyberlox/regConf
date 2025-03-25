import { useStores } from "@/composables/useStores";
import { ref, computed, watch } from "vue";
import { findQuestion } from "./findQuestionInStore";

export default class Validator {
    static async validTemperature(value, store) {
        if (value < -60 || value > 600) {
            store.setErrorMessage('T', 'calcError');
        }
        else {
            store.deleteErrorMessage('T', 'calcError', true);
        }
    }

    static async validPressure(pressure, type, ratio = null, store) {
        if ((pressure.value > 16) ||
            (pressure.value < 0) ||
            (ratio && pressure.value / ratio > 0.7)) {
            store.setErrorMessage(type, 'calcError');
        }
        else if (pressure.value == 0 && type == 'Pn') {
            store.setErrorMessage(type, 'calcError');
        }
        else {
            store.deleteErrorMessage(type, 'calcError', true);
        };
    }

    static async validForNull(val, name, store) {
        if (val && val <= 0 || Array.isArray(val) && val.length && val[0].value !== null && val[0].value <= 0) {
            store.setErrorMessage(name, 'calcError');
        } else {
            store.deleteErrorMessage(name, 'calcError', true);
        }
    }

    static validEnvSumm(paramsToGetCompound, questionsStore, helperStore, summary) {
        const isSecondEnv = paramsToGetCompound.value.isSecondEnv.value

        summary.value = isSecondEnv
            ? [...paramsToGetCompound.value.environment.value, ...paramsToGetCompound.value.secondEnv.value]
            : [...paramsToGetCompound.value.environment.value]

        let sum = 0
        summary.value.forEach(i => {
            if (i?.value) {
                sum += Number(i.value)
                questionsStore.setQuestionValue('bothEnvSumm', sum, 'inputGroup', false, 'envAnswersGroup')
                if (!isSecondEnv) {
                    questionsStore.setQuestionValue('envSumm', sum, 'inputGroup', false, 'envAnswersGroup')
                }
            }
        })

        const targetInput = isSecondEnv ? 'secondEnv' : 'environment'
        const hiddenInput = isSecondEnv ? 'environment' : 'secondEnv'
        const targetQuestion = isSecondEnv ? paramsToGetCompound.value.secondEnv : paramsToGetCompound.value.environment

        helperStore.deleteErrorMessage(hiddenInput)

        if (targetQuestion.value.length > 0) {
            if (sum !== 100) {
                helperStore.setErrorMessage(targetInput)
                return false
            }
            helperStore.deleteErrorMessage(targetInput)
            return true
        }
    }

    static validDownloadJson() {
        const stores = useStores();
        const questions = stores.questionsStore.getQuestions;
        const noErrors = computed(() => stores.helperStore.isValid);
        const jsonError = ref(true);

        const conditions = (question) => {
            if (question.type == 'CheckboxType' ||
                question.inputName == 'secondEnv' ||
                question.inputName == 'additionally' ||
                question.inputName == 'trials' ||
                question.inputName == 'addTrials' ||
                question.inputName == 'OL_num' ||
                question.hidden == true ||
                question.type == 'inputGroup') {
                return true;
            }
            else if (question.inputName == 'inlet_flange' ||
                question.inputName == 'outlet_flange') {
                if (findQuestion('joining_type').value !== 'Фланцевое' || question.value) {
                    return true;
                }
            }
            else if (question.inputName == 'addColor') {
                if (findQuestion('color').value !== 'Другое') {
                    return true;
                } else if (findQuestion('addColor').value) {
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
        console.log(target);

        if (!target.value && noErrors.value) {
            stores.helperStore.deleteErrorMessage('', 'emptyValueError')
            return jsonError.value = false;
        };
        stores.helperStore.setErrorMessage(target.value.inputName, 'emptyValueError')
        return jsonError.value;
    }
}