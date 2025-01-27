<template>
    <!-- ds -->
</template>
<script>
import { watch, computed, onMounted } from "vue";
import { useQuestionsStore } from "@/store/questions";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import { changeToMpa } from "@/utils/changeToMpa";
import Api from "@/utils/Api";
import { usePageStore } from "@/store/page";
import climateGroup from "@/assets/staticJsons/climateGroup.json";

export default {
    setup() {
        const questionsStore = useQuestionsStore();
        const helperStore = useHelperStore();
        const pageStore = usePageStore();
        const envModuleStore = useEnvModuleStore();

        const questions = computed(() => questionsStore.questions);

        const errors = computed(() => helperStore.getMessages);

        const nodeRefs = computed(() => pageStore.getNodeRefs);

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
                preKc: questions.value.find((e) => e.inputName == 'Pre_Kc'),

                T: questions.value.find((e) => e.inputName == 'T'),
                climate: questions.value.find((e) => e.inputName == 'climate'),
            }
        })

        // обработка ошибок
        watch(
            () => [...errors.value],
            (newErrors) => helperStore.handleErrorHighlight(newErrors, nodeRefs),
            { deep: true }
        );

        // Получение сред и их значений
        onMounted(async () => {
            try {
                const data = await Api.get(API_URL + '/get_table');
                envModuleStore.setEnvValues(data);
            } catch (error) {
                console.error('Failed to fetch table data:', error);
            }
        });

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
                // 'material',
                const envParamsToGet = ['molecular_weight', 'density', 'viscosity'];
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
                    if (data.error) return;
                    envModuleStore.setAfterGetCompoundValue(data);
                    envParamsToGet.map((key) => {
                        questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'envAnswersGroup');
                    })
                })
            };
        }, { deep: true })

        // запрос (#3, get_pressure) на "Pno", "Ppo", "P1", "P2","Kw", "Gideal", "pre_DN","DN"
        watch(paramsToGetPressure, (newVal) => {
            if (newVal.pn.value && newVal.pp.value && newVal.ppDin.value && newVal.gab.value && newVal.n.value && newVal.T.value && newVal.climate.value) {
                const paramsToGet = ['Pno', 'Ppo', 'P1', 'P2', 'Kw', 'Gideal', 'pre_DN', 'DN', 'material'];
                const formattedData = {
                    "Pn": Number(changeToMpa(newVal.pn.value[0].id, newVal.pn.value[0].value)), "Pp": Number(newVal.pp.value),
                    "Pp_din": Number(newVal.ppDin.value), "Gab": Number(newVal.gab.value), "N": Number(newVal.n.value), "pre_Kc": Number(newVal.preKc.value), "T": Number(newVal.T.value), "climate": newVal.climate.value
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_pressure',
                    dataToSend.value
                ).then((data) => {
                    if (data.error) return;

                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'pressureAnswersGroup');
                    })
                })
            }
        }, { deep: true })

        // подсказки для климатики
        watch(paramsToGetPressure.value.T, (newVal) => {
            const numberValue = Number(newVal.value);
            switch (true) {
                case numberValue <= 40 && numberValue >= -45:
                    questionsStore.setAnswers('climate', climateGroup, false);
                    helperStore.deleteErrorMessage('T');
                    break;
                case numberValue < -45 && numberValue >= -60:
                    questionsStore.setAnswers('climate', climateGroup.filter((i) => i.value !== 'У1' && i.value !== 'М1'), false);
                    helperStore.deleteErrorMessage('T');
                    break;
                default:
                    questionsStore.setAnswers('climate', [], false);
                    helperStore.setErrorMessage('T');
                    break;
            }
        }
        )
    }
}
</script>