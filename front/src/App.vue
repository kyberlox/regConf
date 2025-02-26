<template>
    <PageHeader />
    <div class="main-content">
        <RouterView />
        <MsgModal v-if="showModal"
                  :modalActive="showModal"
                  @closeModal="closeModal" />
    </div>
    <PageFooter @callSupportModal="showModal = true" />
    <YandexMetrika />
</template>
<script>
import PageHeader from "./components/layout/PageHeader.vue";
import MsgModal from "./components/common/MsgModal.vue"
import PageFooter from "./components/layout/PageFooter.vue";
import { onMounted, ref, watch, computed } from "vue";
import YandexMetrika from "./components/tools/YandexMetrika.vue";
import Api from "./utils/Api";
import { useUserStore } from "./store/user";
import { useHelperStore } from "./store/helper";
export default {
    components: {
        PageHeader,
        PageFooter,
        MsgModal,
        YandexMetrika
    },
    setup() {
        const userStore = useUserStore();
        const helperStore = useHelperStore();
        const showModal = ref(false);
        const isAutorize = computed(() => userStore.getAutorizeStatus)

        const closeModal = () => {
            showModal.value = false;
        }

        //МАСТЕР
        //         onMounted(() => {
        //             Api.get('https://api.ipify.org?format=json').then((res) => {
        //                 userStore.setIp(res.ip)
        //             }).then(() => {
        //                 Api.post(API_URL + '/check', "", false, true)
        //             });
        //         })

        // watch((isAutorize), (newValue) => {
        //     if (newValue == false) {
        //         helperStore.setErrorMessage('tkpError', 'autorizeError');
        //     }
        //     else {
        //         helperStore.deleteErrorMessage('tkpError');
        //     }
        // }, { immediate: true })

        return {
            showModal,
            closeModal
        }
    }
}
</script>
