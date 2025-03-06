import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"
import Api from '@/utils/Api'

export const getTightnessParamsHandle = (stores) => {
    const questionsStore = stores.questionsStore;
    const helperStore = stores.helperStore;
    const envModuleStore = stores.envModuleStore;
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetTightness = computed(() => ({
        contactType: findQuestion('contact_type'),
        inletFlange: findQuestion('inlet_flange'),
        outletFlange: findQuestion('outlet_flange'),
        color: findQuestion('color'),
        packaging: findQuestion('packaging'),
        addTrials: findQuestion('addTrials'),
        addColor: findQuestion('addColor'),

        trials: findQuestion('markAnswersGroup', 'trials'),
        materialBellows: findQuestion('markAnswersGroup', 'material_bellows'),
        materialSpool: findQuestion('markAnswersGroup', 'material_spool'),
        materialSaddle: findQuestion('markAnswersGroup', 'material_saddle'),
        weight: findQuestion('markAnswersGroup', 'weight'),
        paintingArea: findQuestion('markAnswersGroup', 'painting_area'),
        assignment: findQuestion('markAnswersGroup', 'assignment'),
    }));

    // запрос №5, get_tightness 
    watch(paramsToGetTightness, (newVal) => {
        if (newVal.color.value == "Другое") {
            findQuestion('addColor').hidden = false;
        } else {
            findQuestion('addColor').hidden = true;
        }

        if (newVal.contactType.value && newVal.color.value && typeof newVal.color.value == 'string' && noErrors.value) {
            const paramsToGet = ['tightness'];

            const formattedData = {
                "contact_type": newVal.contactType.value,
                "inlet_flange": newVal.inletFlange.value,
                "outlet_flange": newVal.outletFlange.value,
                "color": newVal.color.value == 'Другое' && newVal.addColor.value ? newVal.addColor.value : newVal.color.value,
                "packaging": newVal.packaging.value,
                "material_bellows": newVal.materialBellows.value,
                "material_spool": newVal.materialSpool.value,
                'material_saddle': newVal.materialSaddle.value,
                'weight': newVal.weight.value,
                'painting_area': newVal.paintingArea.value,
                'trials': newVal.addTrials.value ? newVal.addTrials.value + " " + newVal.trials.value : newVal.trials.value,
                'assignment': newVal.assignment.value,
            };

            envModuleStore.pushToAfterGetCompoundValue(formattedData);
            const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);

            // eslint-disable-next-line no-undef
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
