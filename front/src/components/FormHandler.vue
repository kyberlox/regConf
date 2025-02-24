<template>
    <!-- ds -->
</template>
<script>
import { watch, computed, onMounted, ref } from "vue";
import { useQuestionsStore } from "@/store/questions";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import Api from "@/utils/Api";
import Validator from "@/utils/Validator";
import { usePageStore } from "@/store/page";
// import climateGroup from "@/assets/staticJsons/climateGroup.json";
import { findQuestion } from "@/utils/findQuestionInStore";
import { getCompoundParamsHandle } from '@/composables/getCompoundParamsHandle'
import { getPressureParamsHandle } from "@/composables/getPressureParamsHandle";
import { getMarkParamsHandle } from "@/composables/getMarkParamsHandle";
import { getTightnessParamsHandle } from "@/composables/getTightnessParamsHandle";
import { getDocParamsHandle } from "@/composables/getDocParamsHandle";

export default {
    setup() {
        const questionsStore = useQuestionsStore();
        const helperStore = useHelperStore();
        const pageStore = usePageStore();
        const envModuleStore = useEnvModuleStore();

        const errors = computed(() => helperStore.getMessages);

        const nodeRefs = computed(() => pageStore.getNodeRefs);

        const noErrors = computed(() => helperStore.isValid);

        // Получение сред и их значений
        onMounted(async () => {
            try {
                const data = await Api.get(API_URL + '/get_table');
                envModuleStore.setEnvValues(data);
            } catch (error) {
                console.error('Failed to fetch table data:', error);
            }
        });

        getCompoundParamsHandle();
        getPressureParamsHandle();
        getMarkParamsHandle();
        getTightnessParamsHandle();
        getDocParamsHandle();

        // обработка ошибок
        watch(
            () => [...errors.value],
            (newErrors) => { helperStore.handleErrorHighlight(newErrors, nodeRefs) },
            { deep: true }
        );

    }
}
</script>