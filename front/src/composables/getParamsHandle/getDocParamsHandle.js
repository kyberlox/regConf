import { computed, watch } from 'vue'
import { findQuestion } from "@/utils/findQuestionInStore"

export const getDocParamsHandle = (stores) => {
    const helperStore = stores.helperStore;
    const envModuleStore = stores.envModuleStore;
    const noErrors = computed(() => helperStore.isValid);

    const paramsToGetDoc = computed(() => ({
        docs: findQuestion('docs'),
        packaging: findQuestion('packaging'),
        pipeMaterial: findQuestion('pipe_material'),
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
    }));

    // запрос №6, /generate подготовка параметров на отправку
    watch(paramsToGetDoc, (newVal) => {
        if (noErrors.value && (newVal.docs.value || newVal.pipeMaterial.value || newVal.additionally.value || newVal.quantity.value || newVal.olNum.value)) {
            const formattedData = {
                "tightness": newVal.tightness.value,
                "docs": newVal.docs.value,
                "pipe_material": newVal.pipeMaterial.value,
                "additionally": newVal.additionally.value,
                "quantity": newVal.quantity.value,
                "OL_num": newVal.olNum.value,
                "rotary_plugs": newVal.rotaryPlugs.value,
                "thermal_cover": newVal.thermalCover.value,
                "need_ZIP": newVal.needZip.value,
                "acceptance": newVal.acceptance.value,
                "adapters": newVal.adapters.value,
                "needKOF": newVal.needKof.value,
                "abrasive_particles": newVal.abrasiveParticles.value,
            };
            envModuleStore.pushToAfterGetCompoundValue(formattedData);
        }
    }, { deep: true })
}