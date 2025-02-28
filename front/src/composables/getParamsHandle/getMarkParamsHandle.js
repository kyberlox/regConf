import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import Api from '@/utils/Api'

export const getMarkParamsHandle = (stores) => {
    const questionsStore = stores.questionsStore;
    const helperStore = stores.helperStore;
    const envModuleStore = stores.envModuleStore;
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetMark = computed(() => ({
        joiningType: findQuestion('joining_type'),
        needBellows: findQuestion('need_bellows'),
        mark: findQuestion('mark'),
    }));

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
                    if (key == 'open_close_type' || key == 'assignment' || key == 'material_bellows' || key == 'material_spool' || key == 'material_saddle' || key == 'weight' || key == 'painting_area') {
                        questionsStore.setQuestionValue(key, data[key], 'inputGroup', false, 'markAnswersGroup');
                    }
                    else if (key == 'trials') {
                        questionsStore.setQuestionValue(key, data[key])
                    }
                    else if (key == 'contact_type' && typeof data[key] == 'string') {
                        questionsStore.setAnswers(key, [data[key]], false);
                    }
                    else if (key == 'inlet_flange' || key == 'outlet_flange') {
                        if (data[key] == null) {
                            findQuestion('inlet_flange').hidden = true;
                            findQuestion('outlet_flange').hidden = true;
                            questionsStore.setAnswers(key, null, false);
                        }
                        else {
                            findQuestion('inlet_flange').hidden = false;
                            findQuestion('outlet_flange').hidden = false;
                            questionsStore.setAnswers(key, data[key], false);
                        }
                    } else {
                        questionsStore.setAnswers(key, data[key], false);
                    }
                })
            })
        }
    }, { deep: true })
};
