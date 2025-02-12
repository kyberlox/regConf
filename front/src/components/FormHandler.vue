<template>
    <!-- ds -->
</template>
<script>
import { watch, computed, onMounted, ref } from "vue";
import { useQuestionsStore } from "@/store/questions";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import { changeToMpa } from "@/utils/changeToMpa";
import { changeToKgInHour } from "@/utils/changeToKgInHour";
import Api from "@/utils/Api";
import Validator from "@/utils/Validator";
import { usePageStore } from "@/store/page";
// import climateGroup from "@/assets/staticJsons/climateGroup.json";

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
                valveType: questions.value.find((e) => e.inputName == 'valve_type'),
            }
        })

        const paramsToGetMark = computed(() => {
            return {
                joiningType: questions.value.find((e) => e.inputName == 'joining_type'),
                needBellows: questions.value.find((e) => e.inputName == 'need_bellows'),
            }
        })

        const paramsToGetTightness = computed(() => {
            return {
                contactType: questions.value.find((e) => e.inputName == 'contact_type'),
                inletFlange: questions.value.find((e) => e.inputName == 'inlet_flange'),
                outletFlange: questions.value.find((e) => e.inputName == 'outlet_flange'),
                color: questions.value.find((e) => e.inputName == 'color'),
                packaging: questions.value.find((e) => e.inputName == 'packaging'),
            }
        })

        // обработка ошибок
        watch(
            () => [...errors.value],
            (newErrors) => { helperStore.handleErrorHighlight(newErrors, nodeRefs) },
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
        const checkEnvSum = () => {
            const isSecondEnv = paramsToGetCompound.value.isSecondEnv.value;

            const summary = ref([]);
            isSecondEnv ?
                summary.value = [...paramsToGetCompound.value.environment.value, ...paramsToGetCompound.value.secondEnv.value] : summary.value = [...paramsToGetCompound.value.environment.value];

            let sum = 0;
            summary.value.map((i) => {
                if (i && i.value) {
                    sum += Number(i.value);
                    questionsStore.setQuestionValue('bothEnvSumm', sum, 'inputGroup', false, 'envAnswersGroup')
                    if (!isSecondEnv) {
                        questionsStore.setQuestionValue('envSumm', sum, 'inputGroup', false, 'envAnswersGroup')
                    }
                }
            })

            const targetInput = isSecondEnv ? 'bothEnvSumm' : 'envSumm';
            const hiddenInput = isSecondEnv ? 'envSumm' : 'bothEnvSumm';
            const targetQuestion = isSecondEnv ? paramsToGetCompound.value.secondEnv : paramsToGetCompound.value.environment;

            helperStore.deleteErrorMessage(hiddenInput);

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
        watch([paramsToGetCompound.value.environment, paramsToGetCompound.value.secondEnv], ([EnvVal, secVal]) => {
            if (checkEnvSum()) {
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
            Validator.validTemperature(newVal.T.value, helperStore);

            // Проверка давления
            let settingPressure = { unit: newVal.pn.value[0]?.id, value: newVal.pn.value[0]?.value };
            let staticPressure = { unit: newVal.pp.value[0]?.id, value: newVal.pp.value[0]?.value };
            let dynamicPressure = { unit: newVal.ppDin.value[0]?.id, value: newVal.ppDin.value[0]?.value };

            if (settingPressure) {
                Validator.validPressure(settingPressure, 'Pn', null, helperStore, changeToMpa);
                if (staticPressure) {
                    Validator.validPressure(staticPressure, 'Pp', settingPressure.value, helperStore, changeToMpa);
                }
                if (dynamicPressure) {
                    Validator.validPressure(dynamicPressure, 'Pp_din', settingPressure.value, helperStore, changeToMpa);
                }
            }

            if (newVal.pn.value && newVal.pp.value && newVal.ppDin.value && newVal.gab.value && newVal.n.value && newVal.T.value && newVal.climate.value && newVal.valveType.value) {
                const paramsToGet = ['Pno', 'Ppo', 'P1', 'P2', 'Kw', 'Gideal', 'pre_DN', "DN_s", 'DN', "PN", "need_bellows", "PN2", "DN2"];

                const formattedData = {
                    "Pn": Number(newVal.pn.value[0].value),
                    "Pp": Number(newVal.pp.value[0].value),
                    "Pp_din": Number(newVal.ppDin.value[0].value),
                    "Gab": Number(newVal.gab.value[0].value),
                    "N": Number(newVal.n.value),
                    "pre_Kc": Number(newVal.preKc.value),
                    "T": Number(newVal.T.value),
                    "climate": newVal.climate.value,
                    "valve_type": newVal.valveType.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_pressure',
                    dataToSend.value
                ).then((data) => {
                    if (data.error) return;

                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        if (key == 'need_bellows') {
                            if (data[key]) {
                                if (typeof (data[key]) == 'string') {
                                    questionsStore.setQuestionValue(key, data[key]);
                                    questionsStore.setQuestionDisabled('need_bellows', true);
                                }
                            }
                            else {
                                questionsStore.setQuestionDisabled('need_bellows', false);
                            }
                        }
                        else {
                            questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'pressureAnswersGroup');
                        }
                    })
                })
            }
        }, { deep: true })

        // подсказки для климатики
        // watch(paramsToGetPressure.value.T, (newVal) => {
        //     const numberValue = Number(newVal.value);
        //     switch (true) {
        //         case numberValue <= 40 && numberValue >= -40:
        //             questionsStore.setAnswers('climate', climateGroup, false);
        //             helperStore.deleteErrorMessage('T');
        //             break;
        //         case numberValue < -40 && numberValue >= -60:
        //             questionsStore.setAnswers('climate', climateGroup.filter((i) => i.value !== 'У1' && i.value !== 'М1'), false);
        //             helperStore.deleteErrorMessage('T');
        //             break;
        //         default:
        //             questionsStore.setAnswers('climate', [], false);
        //             helperStore.setErrorMessage('T');
        //             break;
        //     }
        // })

        // запрос (#4, get_mark_params) на "Pno", "Ppo", "P1", "P2","Kw", "Gideal", "pre_DN","DN"
        watch(paramsToGetMark, (newVal) => {
            if (newVal.joiningType.value || newVal.needBellows.value) {
                const paramsToGet = ['contact_type', 'open_close_type', 'inlet_flange', 'outlet_flange', 'color', 'packaging', 'assignment'];

                const formattedData = {
                    "joining_type": newVal.joiningType.value,
                    "need_bellows": newVal.needBellows.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_mark_params',
                    dataToSend.value
                ).then((data) => {
                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        if (key == 'open_close_type' || key == 'assignment') {
                            questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'markAnswersGroup');
                        }
                        else {
                            questionsStore.setAnswers(key, data[key], false);
                        }
                    })
                })
            }
        }, { deep: true })

        // запрос №5, get_tightness 
        watch(paramsToGetTightness, (newVal) => {
            if (newVal.contactType.value && newVal.inletFlange.value && newVal.outletFlange.value && newVal.color.value) {
                const paramsToGet = ['tightness'];

                const formattedData = {
                    "contact_type": newVal.contactType.value,
                    "inlet_flange": newVal.inletFlange.value,
                    "outlet_flange": newVal.outletFlange.value,
                    "color": newVal.color.value,
                    "packaging": newVal.packaging.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_tightness',
                    dataToSend.value
                ).then((data) => {
                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        questionsStore.setAnswers(key, data[key], false);
                    })
                })
            }
        }, { deep: true })
    }
}
</script>