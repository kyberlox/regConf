import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import { useQuestionsStore } from '@/store/questions'
import { useHelperStore } from '@/store/helper'
import { useEnvModuleStore } from '@/store/envModule'
import Api from '@/utils/Api'

export const getTightnessParamsHandle = () => {
    const questionsStore = useQuestionsStore();
    const helperStore = useHelperStore();
    const envModuleStore = useEnvModuleStore();
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetTightness = computed(() => ({
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
    }));

    // запрос №5, get_tightness 
    const watchForFetch = () => {
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
    };

    watchForFetch();
}