import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import Api from "@/utils/Api";
import Validator from '@/utils/Validator';
import { changeToMpa } from "@/utils/changeToMpa";


export const getPressureParamsHandle = (stores) => {
    const questionsStore = stores.questionsStore;
    const helperStore = stores.helperStore;
    const envModuleStore = stores.envModuleStore;
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetPressure = computed(() => ({
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
    }));


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

    }, { deep: true });
}

