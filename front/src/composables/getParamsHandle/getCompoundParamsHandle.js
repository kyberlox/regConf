import { computed, watch, ref } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import Api from "@/utils/Api";

export const getCompoundParamsHandle = (stores) => {
    const questionsStore = stores.questionsStore;
    const helperStore = stores.helperStore;
    const envModuleStore = stores.envModuleStore;
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetCompound = computed(() => ({
        environmentType: findQuestion('environmentType'),
        environment: findQuestion('environment'),
        envSumm: findQuestion('envAnswersGroup', 'envSumm'),
        isSecondEnv: findQuestion('isSecondEnv'),
        secondEnv: findQuestion('secondEnv'),
        bothEnvSumm: findQuestion('envAnswersGroup', 'bothEnvSumm'),
        climate: findQuestion('climate'),
    }))

    // обновляю options у селекта состава при выборе др агрегатного
    watch(() => paramsToGetCompound.value.environmentType, (newVal) => {
        questionsStore.reloadEnvTypes(newVal.value)
    }, { deep: true })

    const changeVisibility = (newVal) => {
        paramsToGetCompound.value.envSumm.hidden = newVal.value
        paramsToGetCompound.value.secondEnv.hidden = !newVal.value
        paramsToGetCompound.value.bothEnvSumm.hidden = !newVal.value
    }

    watch(() => paramsToGetCompound.value.isSecondEnv, (newVal) => {
        changeVisibility(newVal)
    }, { deep: true })


    const checkEnvSum = () => {
        const isSecondEnv = paramsToGetCompound.value.isSecondEnv.value
        const summary = ref([])

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

        const targetInput = isSecondEnv ? 'bothEnvSumm' : 'envSumm'
        const hiddenInput = isSecondEnv ? 'envSumm' : 'bothEnvSumm'
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

    watch(
        () => [
            paramsToGetCompound.value.environment.value.length,
            paramsToGetCompound.value.secondEnv.value.length
        ],
        ([envLength, secondEnvLength]) => {
            if (envLength || secondEnvLength) {
                checkEnvSum()
            }
        }
    )


    // запрос (#2, get_compound) на параметры для конкр сред (Вязкость, материал, молекулярная масса, вязкость)
    watch(paramsToGetCompound, (newVal) => {
        if ((newVal.environment.value || newVal.secondEnv.value) && newVal.climate.value && noErrors.value) {
            const envParamsToGet = ['molecular_weight', 'density', 'material', 'viscosity'];
            let dataToSend = [];

            if (paramsToGetCompound.value.isSecondEnv.value) {
                dataToSend = paramsToGetCompound.value.environment.value;
                dataToSend = [...paramsToGetCompound.value.secondEnv.value, ...dataToSend];
            } else {
                dataToSend = paramsToGetCompound.value.environment.value;
            }

            const formattedData = dataToSend.map(obj => ({
                'id': Number(obj.id),
                'r': Number(obj.value) / 100,
            }));
            formattedData.push({ "climate": paramsToGetCompound.value.climate.value })

            // eslint-disable-next-line no-undef
            Api.post(API_URL + '/get_compound',
                formattedData
            ).then(data => {
                helperStore.deleteErrorMessage('', 'serverError');
                envModuleStore.setAfterGetCompoundValue(data);
                envParamsToGet.map((key) => {
                    if (key == 'climate') {
                        questionsStore.setQuestionValue(key, data[key])
                    } else {
                        questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'envAnswersGroup');
                    }
                })
            })
        };
    }, { deep: true });
}
