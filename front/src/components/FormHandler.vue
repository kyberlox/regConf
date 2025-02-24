<template>
    <!-- ds -->
</template>
<script>
import { watch, computed, onMounted, ref } from "vue";
import { useQuestionsStore } from "@/store/questions";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import { changeToMpa } from "@/utils/changeToMpa";
import Api from "@/utils/Api";
import Validator from "@/utils/Validator";
import { usePageStore } from "@/store/page";
// import climateGroup from "@/assets/staticJsons/climateGroup.json";
import { findQuestion } from "@/utils/findQuestionInStore";
import { getCompoundHandleParams } from '@/composables/getCompoundParamsHandle'


export default {
    setup() {
        const questionsStore = useQuestionsStore();
        const helperStore = useHelperStore();
        const pageStore = usePageStore();
        const envModuleStore = useEnvModuleStore();

        const errors = computed(() => helperStore.getMessages);

        const nodeRefs = computed(() => pageStore.getNodeRefs);

        const noErrors = computed(() => helperStore.isValid);

        getCompoundHandleParams();
        // const paramsToGetCompound = computed(() => {
        //     return {
        //         environmentType: findQuestion('environmentType'),
        //         environment: findQuestion('environment'),
        //         envSumm: findQuestion('envAnswersGroup', 'envSumm'),
        //         isSecondEnv: findQuestion('isSecondEnv'),
        //         secondEnv: findQuestion('secondEnv'),
        //         bothEnvSumm: findQuestion('envAnswersGroup', 'bothEnvSumm'),
        //         climate: findQuestion('climate'),
        //     }
        // })
        const paramsToGetPressure = computed(() => {
            return {
                pn: findQuestion('Pn'),
                pp: findQuestion('Pp'),
                ppDin: findQuestion('Pp_din'),
                gab: findQuestion('Gab'),
                n: findQuestion('N'),
                preKc: findQuestion('Pre_Kc'),
                climate: findQuestion('climate'),
                T: findQuestion('T'),
                valveType: findQuestion('valve_type'),
                forceOpen: findQuestion('force_open'),
            }
        })

        const paramsToGetMark = computed(() => {
            return {
                joiningType: findQuestion('joining_type'),
                needBellows: findQuestion('need_bellows'),
                mark: findQuestion('mark'),
            }
        })

        const paramsToGetTightness = computed(() => {
            return {
                contactType: findQuestion('contact_type'),
                inletFlange: findQuestion('inlet_flange'),
                outletFlange: findQuestion('outlet_flange'),
                color: findQuestion('color'),
                packaging: findQuestion('packaging'),

                materialBellows: findQuestion('markAnswersGroup', 'material_bellows'),
                materialSpool: findQuestion('markAnswersGroup', 'material_spool'),
                materialSaddle: findQuestion('markAnswersGroup', 'material_saddle'),
                weight: findQuestion('markAnswersGroup', 'weight'),
                paintingArea: findQuestion('markAnswersGroup', 'painting_area'),
                trials: findQuestion('markAnswersGroup', 'trials'),
                assignment: findQuestion('markAnswersGroup', 'assignment'),
            }
        })

        const paramsToGenerateDoc = computed(() => {
            return {
                docs: findQuestion('docs'),
                packaging: findQuestion('pipe_material'),
                pipeMaterial: findQuestion('packaging'),
                additionally: findQuestion('additionally'),
                quantity: findQuestion('quantity'),
                olNum: findQuestion('OL_num'),
                tightness: findQuestion('tightness'),
                rotaryPlugs: findQuestion('additionalAnswersGroup', 'rotary_plugs'),
                needZip: findQuestion('additionalAnswersGroup', 'need_ZIP'),
                thermalCover: findQuestion('additionalAnswersGroup', 'thermal_cover'),
                acceptance: findQuestion('additionalAnswersGroup', 'acceptance'),
                adapters: findQuestion('additionalAnswersGroup', 'adapters'),
                needKof: findQuestion('additionalAnswersGroup', 'needKOF'),
                abrasiveParticles: findQuestion('additionalAnswersGroup', 'abrasive_particles'),
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
        // watch(paramsToGetCompound.value.environmentType, (newVal) => {
        //     questionsStore.reloadEnvTypes(newVal.value);
        // }, { deep: true });

        // Если в другом агрегатном состоянии не активен чекбокс -> скрываю №5
        // const changeVisibility = (newVal) => {
        //     paramsToGetCompound.value.envSumm.hidden = newVal.value;
        //     paramsToGetCompound.value.secondEnv.hidden = !newVal.value;
        //     paramsToGetCompound.value.bothEnvSumm.hidden = !newVal.value;
        // }
        // watch(paramsToGetCompound.value.isSecondEnv, (newVal) => {
        //     changeVisibility(newVal);
        // })

        // проверка суммы всех состояний
        // const checkEnvSum = () => {
        //     const isSecondEnv = paramsToGetCompound.value.isSecondEnv.value;

        //     const summary = ref([]);
        //     isSecondEnv ?
        //         summary.value = [...paramsToGetCompound.value.environment.value, ...paramsToGetCompound.value.secondEnv.value] : summary.value = [...paramsToGetCompound.value.environment.value];

        //     let sum = 0;
        //     summary.value.map((i) => {
        //         if (i && i.value) {
        //             sum += Number(i.value);
        //             questionsStore.setQuestionValue('bothEnvSumm', sum, 'inputGroup', false, 'envAnswersGroup')
        //             if (!isSecondEnv) {
        //                 questionsStore.setQuestionValue('envSumm', sum, 'inputGroup', false, 'envAnswersGroup')
        //             }
        //         }
        //     })

        //     const targetInput = isSecondEnv ? 'bothEnvSumm' : 'envSumm';
        //     const hiddenInput = isSecondEnv ? 'envSumm' : 'bothEnvSumm';
        //     const targetQuestion = isSecondEnv ? paramsToGetCompound.value.secondEnv : paramsToGetCompound.value.environment;

        //     helperStore.deleteErrorMessage(hiddenInput);

        //     if (targetQuestion.value.length > 0) {
        //         if (sum !== 100) {
        //             helperStore.setErrorMessage(targetInput);
        //             return false;
        //         }
        //         else {
        //             helperStore.deleteErrorMessage(targetInput);
        //             return true;
        //         }
        //     }
        // }

        // Проверка суммы по агрегатным состояниям
        // watch(
        //     () => [
        //         paramsToGetCompound.value.environment.value.length,
        //         paramsToGetCompound.value.secondEnv.value.length
        //     ],
        //     ([envLength, secondEnvLength]) => {
        //         if ((envLength || secondEnvLength)
        //         ) {
        //             checkEnvSum();
        //         }
        //     }
        // );

        // // запрос (#2, get_compound) на параметры для конкр сред (Вязкость, материал, молекулярная масса, вязкость)
        // watch(paramsToGetCompound, (newVal) => {
        //     if ((newVal.environment.value || newVal.secondEnv.value) && newVal.climate.value && noErrors.value) {
        //         const envParamsToGet = ['molecular_weight', 'density', 'material', 'viscosity'];
        //         let dataToSend = [];

        //         if (paramsToGetCompound.value.isSecondEnv.value) {
        //             dataToSend = paramsToGetCompound.value.environment.value;
        //             dataToSend = [...paramsToGetCompound.value.secondEnv.value, ...dataToSend];
        //         } else {
        //             dataToSend = paramsToGetCompound.value.environment.value;
        //         }

        //         const formattedData = dataToSend.map(obj => ({
        //             'id': Number(obj.id),
        //             'r': Number(obj.value) / 100,
        //         }));
        //         formattedData.push({ "climate": paramsToGetCompound.value.climate.value })

        //         Api.post(API_URL + '/get_compound',
        //             formattedData
        //         ).then(data => {
        //             helperStore.deleteErrorMessage('', 'serverError');
        //             envModuleStore.setAfterGetCompoundValue(data);
        //             envParamsToGet.map((key) => {
        //                 if (key == 'climate') {
        //                     questionsStore.setQuestionValue(key, data[key])
        //                 } else {
        //                     questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'envAnswersGroup');
        //                 }
        //             })
        //         })
        //     };
        // }, { deep: true });

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

            // Проверка работающих клапанов !== 0
            if (newVal.n.value && newVal.n.value == 0) {
                helperStore.setErrorMessage('N');
            } else {
                helperStore.deleteErrorMessage('N');
            }

            // Проверка расхода жидкости и газа
            if (newVal.gab.value.length && newVal.gab.value[0].value == 0) {
                helperStore.setErrorMessage('Gab');
            } else {
                helperStore.deleteErrorMessage('Gab');
            }

            if (noErrors.value && newVal.pn.value && newVal.pp.value && newVal.ppDin.value && newVal.gab.value && newVal.n.value && newVal.T.value && newVal.valveType.value) {
                const paramsToGet = ['Pno', 'Ppo', 'P1', 'P2', 'Kw', 'Gideal', 'pre_DN', "DN_s", 'DN', "PN", "need_bellows", "PN2", "DN2"];

                const formattedData = {
                    "Pn": Number(newVal.pn.value[0].value),
                    "Pp": Number(newVal.pp.value[0].value),
                    "Pp_din": Number(newVal.ppDin.value[0].value),
                    "Gab": Number(newVal.gab.value[0].value),
                    "N": Number(newVal.n.value),
                    "pre_Kc": newVal.preKc.value,
                    "T": Number(newVal.T.value),
                    "valve_type": newVal.valveType.value,
                    "force_open": newVal.forceOpen.value == null ? false : newVal.forceOpen.value,
                    "climate": newVal.climate.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);

                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_pressure',
                    dataToSend.value
                ).then((data) => {
                    if (data.err) {
                        helperStore.setErrorMessage(data.err, 'serverError')
                    } else {
                        helperStore.deleteErrorMessage('', 'serverError');
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
                    }
                })
            }

        }, { deep: true })

        // запрос (#4, get_mark_params) на "Pno", "Ppo", "P1", "P2","Kw", "Gideal", "pre_DN","DN"
        watch(paramsToGetMark, (newVal) => {
            if (((newVal.joiningType.value || newVal.needBellows.value) && noErrors.value)) {
                const paramsToGet = ['contact_type', 'open_close_type', 'inlet_flange', 'outlet_flange', 'color', 'packaging', 'assignment', 'material_bellows', 'material_spool', 'material_saddle', 'weight', 'painting_area', 'trials'];

                const formattedData = {
                    "joining_type": newVal.joiningType.value,
                    "need_bellows": newVal.needBellows.value,
                    "mark": newVal.mark.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);
                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_mark_params',
                    dataToSend.value
                ).then((data) => {
                    helperStore.deleteErrorMessage('', 'serverError');
                    // if (data.err) return;
                    paramsToGet.map((key) => {
                        if (key == 'open_close_type' || key == 'assignment' || key == 'material_bellows' || key == 'material_spool' || key == 'material_saddle' || key == 'weight' || key == 'painting_area' || key == 'trials') {
                            questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'markAnswersGroup');
                        }
                        else if (key == 'contact_type' && typeof data[key] == 'string') {
                            questionsStore.setAnswers(key, [data[key]], false);
                        }
                        else if (key == 'inlet_flange' || key == 'outlet_flange') {
                            if (data[key] == null) {
                                paramsToGetTightness.value.inletFlange.hidden = true;
                                paramsToGetTightness.value.outletFlange.hidden = true;
                                questionsStore.setAnswers(key, null, false);
                            }
                            else {
                                paramsToGetTightness.value.inletFlange.hidden = false;
                                paramsToGetTightness.value.outletFlange.hidden = false;
                                questionsStore.setAnswers(key, data[key], false);
                            }
                        } else {
                            questionsStore.setAnswers(key, data[key], false);
                        }
                    })
                })
            }
        }, { deep: true })

        // запрос №5, get_tightness 
        watch(paramsToGetTightness, (newVal) => {
            if (newVal.contactType.value && newVal.color.value && typeof newVal.color.value == 'string' && noErrors.value) {
                const paramsToGet = ['tightness'];

                const formattedData = {
                    "contact_type": newVal.contactType.value,
                    "inlet_flange": newVal.inletFlange.value,
                    "outlet_flange": newVal.outletFlange.value,
                    "color": newVal.color.value,
                    "packaging": newVal.packaging.value,
                    "material_bellows": newVal.materialBellows.value,
                    "material_spool": newVal.materialSpool.value,
                    'material_saddle': newVal.materialSaddle.value,
                    'weight': newVal.weight.value,
                    'painting_area': newVal.paintingArea.value,
                    'trials': newVal.trials.value,
                    'assignment': newVal.assignment.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);
                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

                Api.post(API_URL + '/get_tightness',
                    dataToSend.value
                ).then((data) => {
                    helperStore.deleteErrorMessage('', 'serverError');
                    // if (data.err) return;
                    envModuleStore.setAfterGetCompoundValue(data);
                    paramsToGet.map((key) => {
                        questionsStore.setAnswers(key, data[key], false);
                    })
                })
            }
        }, { deep: true })

        // запрос №6, /generate подготовка параметров на отправку
        watch(paramsToGenerateDoc, (newVal) => {
            if (noErrors.value && (newVal.docs.value || newVal.pipeMaterial.value || newVal.additionally.value || newVal.quantity.value || newVal.olNum.value)) {
                const formattedData = {
                    "tightness": newVal.tightness.value,
                    "docs": newVal.docs.value,
                    "pipe_material": newVal.pipeMaterial.value,
                    "additionally": newVal.additionally.value,
                    "quantity": newVal.quantity.value,
                    "OL_num": newVal.olNum.value,
                    "rotary_plugs": newVal.rotaryPlugs.value,
                    "thermal_cover": newVal.needZip.value,
                    "need_ZIP": newVal.thermalCover.value,
                    "acceptance": newVal.acceptance.value,
                    "adapters": newVal.adapters.value,
                    "needKOF": newVal.needKof.value,
                    "abrasive_particles": newVal.abrasiveParticles.value,
                };

                envModuleStore.pushToAfterGetCompoundValue(formattedData);
            }
        }, { deep: true })
    }
}
</script>