import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import Api from "@/utils/Api";
import Validator from '@/utils/Validator';

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
        let settingPressure = { unit: newVal.pn.convertedValue?.id, value: newVal.pn.convertedValue?.value };
        let staticPressure = { unit: newVal.pp.convertedValue?.id, value: newVal.pp.convertedValue?.value };
        let dynamicPressure = { unit: newVal.ppDin.convertedValue?.id, value: newVal.ppDin.convertedValue?.value };

        if (settingPressure) {
            Validator.validPressure(settingPressure, 'Pn', null, helperStore);
            if (staticPressure) {
                Validator.validPressure(staticPressure, 'Pp', settingPressure.value, helperStore);
            }
            if (dynamicPressure) {
                Validator.validPressure(dynamicPressure, 'Pp_din', settingPressure.value, helperStore);
            }
        }

        // Проверка работающих клапанов !== 0
        Validator.validForNull(newVal.n.value, newVal.n.inputName, helperStore);
        // Проверка расхода жидкости и газа
        Validator.validForNull(newVal.gab.value, newVal.gab.inputName, helperStore);

        if (noErrors.value && newVal.pn.value && newVal.pp.value && newVal.ppDin.value && newVal.gab.value && newVal.n.value && newVal.T.value && newVal.valveType.value) {
            const paramsToGet = ['Pno', 'Ppo', 'P1', 'P2', 'Kw', 'Gideal', 'pre_DN', "DN_s", 'DN', "PN", "need_bellows", "PN2", "DN2", "S", "S_eff"];

            const formattedData = {
                "Pn": Number(newVal.pn.convertedValue.value),
                "Pp": Number(newVal.pp.convertedValue.value),
                "Pp_din": Number(newVal.ppDin.convertedValue.value),
                "Gab": Number(newVal.gab.convertedValue.value),
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

