<template>
    <PageHeader />
    <main class="main-content">
        <RouterView />
        <MsgModal v-if="showModal"
                  :type="modalType"
                  :modalActive="showModal"
                  @closeModal="toggleModal(false)" />
    </main>
    <PageFooter @callSupportModal="toggleModal(true)" />
    <YandexMetrika />
</template>

<script>
import { defineComponent } from 'vue'
import { onMounted, ref, watch, computed } from "vue"
import { useStores } from "@/composables/useStores"
import { updateHistory } from "./composables/updateHistory"
import Api from "./utils/Api"
import PageHeader from "./components/layout/PageHeader.vue"
import PageFooter from "./components/layout/PageFooter.vue"
import MsgModal from "./components/common/MsgModal.vue"
import YandexMetrika from "./components/tools/YandexMetrika.vue"

export default defineComponent({
    name: 'App',
    components: {
        PageHeader,
        PageFooter,
        MsgModal,
        YandexMetrika,
    },
    setup() {
        const stores = useStores()
        const showModal = ref(false)
        const isAutorize = computed(() => stores.userStore.getAutorizeStatus)

        const toggleModal = (value) => {
            showModal.value = value
        }

        const handleAuthCheck = () => {
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
        }

        onMounted(handleAuthCheck)

        watch(isAutorize, (newValue) => {
            if (newValue === false) {
                stores.helperStore.setErrorMessage('tkpError', 'autorizeError')
            } else {
                stores.helperStore.deleteErrorMessage('tkpError')
            }
        })

        return {
            showModal,
            toggleModal,
            modalType: 'support'
        }
    }
})
</script>
