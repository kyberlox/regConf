<template>
    <PageHeader />
    <div class="main-content">
        <RouterView />
        <MsgModal v-if="showModal"
                  :type="modalType"
                  :modalActive="showModal"
                  @closeModal="closeModal" />
        <Toast />
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
import { updateHistory } from "./composables/updateHistory";
import { useStores } from "@/composables/useStores";
import Toast from "./components/common/Toast.vue";

export default {
    components: {
        PageHeader,
        PageFooter,
        MsgModal,
        YandexMetrika,
        Toast
    },
    setup() {
        const stores = useStores();
        const showModal = ref(false);
        const isAutorize = computed(() => stores.userStore.getAutorizeStatus);

        const closeModal = () => {
            showModal.value = false;
        }

        onMounted(() => {
            Api.get('https://api.ipify.org?format=json')
                .then((res) => {
                    stores.userStore.setIp(res.ip)
                }).then(() => {
                    Api.post(API_URL + '/check', "", false, true)
                        .then((res) => {
                            if (res.token_valid == false || res.error) {
                                stores.userStore.setAutorizeStatus(false);
                            } else {
                                stores.userStore.setAutorizeStatus(true);
                                updateHistory();
                            }
                        })
                });
        })

        watch((isAutorize), (newValue) => {
            if (newValue !== null && newValue == false) {
                stores.helperStore.setErrorMessage('tkpError', 'autorizeError');
            }
            else {
                stores.helperStore.deleteErrorMessage('tkpError');
            }
        })

        return {
            showModal,
            closeModal,
            modalType: 'support',

        }
    }
}
</script>
