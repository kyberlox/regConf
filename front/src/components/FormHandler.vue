<template>
    <!-- ds -->
</template>
<script>
import { watch, computed } from "vue";
import { useQuestionsStore } from "@/store/questions";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import { changeToMpa } from "@/utils/changeToMpa";
import Api from "@/utils/Api";
export default {
    setup() {

        const questionsStore = useQuestionsStore();
        const helperStore = useHelperStore();
        const envModuleStore = useEnvModuleStore();

        const questions = computed(() => questionsStore.questions);
        const paramsToGetCompound = computed(() => {
            return {
                environmentType: questions.value.find((e) => e.inputName == 'environmentType'),
                environment: questions.value.find((e) => e.inputName == 'environment'),
                envSumm: questions.value.find((e) => e.inputName == 'envAnswersGroup').answers.find((e) => e.inputName == 'envSumm'),
                isSecondEnv: questions.value.find((e) => e.inputName == 'isSecondEnv'),
                secondEnv: questions.value.find((e) => e.inputName == 'secondEnv'),
                bothEnvSumm: questions.value.find((e) => e.inputName == 'envAnswersGroup').answers.find((e) => e.inputName == 'bothEnvSumm')
            }
        })
        const paramsToGetPressure = computed(() => {
            return {
                pn: questions.value.find((e) => e.inputName == 'Pn'),
                pp: questions.value.find((e) => e.inputName == 'Pp'),
                ppDin: questions.value.find((e) => e.inputName == 'Pp_din'),
                gab: questions.value.find((e) => e.inputName == 'Gab'),
                n: questions.value.find((e) => e.inputName == 'N'),
                preKc: questions.value.find((e) => e.inputName == 'Pre_Kc')
            }
        })

        // заполнение селектов при выборе агрегатного состояния
        watch(paramsToGetCompound.value.environmentType, (newVal) => {
            questionsStore.reloadEnvTypes(newVal.value);
        }, { deep: true });

        // Если в другом агрегатном состоянии не активен чекбокс -> скрываю №5
        const changeVisibility = (newVal) => {
            paramsToGetCompound.value.envSumm.hidden = newVal.value;
            paramsToGetCompound.value.secondEnv.hidden = !newVal.value;
            paramsToGetCompound.value.bothEnvSumm.hidden = !newVal.value;
        }
        watch(paramsToGetCompound.value.isSecondEnv, (newVal) => {
            changeVisibility(newVal);
        })

        // проверка суммы всех состояний
        const checkSum = () => {
            const isSecondEnv = paramsToGetCompound.value.isSecondEnv.value;

            const targetInput = isSecondEnv ? 'bothEnvSumm' : 'envSumm';
            const hiddenInput = isSecondEnv ? 'envSumm' : 'bothEnvSumm';
            const targetQuestion = isSecondEnv ? paramsToGetCompound.value.secondEnv : paramsToGetCompound.value.environment;

            helperStore.deleteErrorMessage(hiddenInput);

            let sum = 0;
            targetQuestion.value.map((i) => {
                if (i && i.value) {
                    isSecondEnv ? sum += Number(i.value) + paramsToGetCompound.value.envSumm.value :
                        sum += Number(i.value);
                    questionsStore.setQuestionValue(targetInput, sum, 'inputGroup', false, 'envAnswersGroup')
                }
            })
            if (targetQuestion.value.length > 0) {
                if (sum !== 100) {
                    helperStore.setErrorMessage(targetInput);
                    console.log(targetInput);

                    return false;
                }
                else {
                    helperStore.deleteErrorMessage(targetInput);
                    return true;
                }
            }
        }

        // запрос (#2, get_compound) на параметры для конкр сред (Вязкость, материал, молекулярная масса, вязкость)
        watch([paramsToGetCompound.value.environment, paramsToGetCompound.value.secondEnv], (newVal) => {
            if (checkSum()) {
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
                    'r': Number(obj.value) / 100
                }));
                Api.post(API_URL + '/get_compound',
                    formattedData
                ).then(data => {
                    envModuleStore.setAfterGetCompoundValue(data);
                    envParamsToGet.map((key) => {
                        questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'pressureAnswersGroup');
                    })
                })
            };
        }, { deep: true })

        // запрос (#3, get_pressure) на "Pno", "Ppo", "P1", "P2","Kw", "Gideal", "pre_DN","DN"
        watch(paramsToGetPressure, (newVal) => {
            if (newVal.pn.value && newVal.pp.value && newVal.ppDin.value && newVal.gab.value && newVal.n.value && newVal.preKc.value) {
                const paramsToGet = ['Pno', 'Ppo', 'P1', 'P2', 'Kw', 'Gideal', 'pre_DN', 'DN'];

                const formattedData = {
                    "Pn": Number(changeToMpa(newVal.pn.value[0].id, newVal.pn.value[0].value)), "Pp": Number(newVal.pp.value),
                    "Pp_din": Number(newVal.ppDin.value), "Gab": Number(newVal.gab.value), "N": Number(newVal.n.value), "pre_Kc": Number(newVal.preKc.value)
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_pressure',
                    dataToSend.value
                ).then((data) => {
                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        questionsStore.setQuestionValue(key, data[key]);
                    })
                })
            }
        }, { deep: true })
    }
}
</script>