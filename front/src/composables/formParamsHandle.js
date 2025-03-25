import { computed, onMounted, watch } from "vue";
import { getCompoundParamsHandle } from '@/composables/getParamsHandle/getCompoundParamsHandle'
import { getPressureParamsHandle } from "@/composables/getParamsHandle/getPressureParamsHandle";
import { getMarkParamsHandle } from "@/composables/getParamsHandle/getMarkParamsHandle";
import { getTightnessParamsHandle } from "@/composables/getParamsHandle/getTightnessParamsHandle";
import { getDocParamsHandle } from "@/composables/getParamsHandle/getDocParamsHandle";
import Api from "@/utils/Api";

export const formParamsHandle = (stores) => {
    // отслеживание ошибок
    const nodeRefs = computed(() => stores.pageStore.getNodeRefs);
    stores.helperStore.watchErrors(nodeRefs);

    // Получение сред и их значений
    onMounted(async () => {
        try {
            // eslint-disable-next-line no-undef
            const data = await Api.get(API_URL + '/get_table');
            stores.envModuleStore.setEnvValues(data);
        } catch (error) {
            console.error('Failed to fetch table data:', error);
        }
    });


    getCompoundParamsHandle(stores);
    getPressureParamsHandle(stores);
    getMarkParamsHandle(stores);
    getTightnessParamsHandle(stores);
    getDocParamsHandle(stores);
}

