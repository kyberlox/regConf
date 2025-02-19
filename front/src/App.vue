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
import { ref } from "vue";
import YandexMetrika from "./components/tools/YandexMetrika.vue";
export default {
    components: {
        PageHeader,
        PageFooter,
        MsgModal,
        YandexMetrika
    },
    setup() {
        const showModal = ref(false);
        const closeModal = () => {
            showModal.value = false;
        }
        return {
            showModal,
            closeModal
        }
    }
}
</script>
