<template>
    <PageHeader />
    <div class="main-content">
        <RouterView />
        <MsgModal v-if="showModal"
                  :modalActive="showModal"
                  @closeModal="showModal = false" />
    </div>
    <PageFooter @callSupportModal="showModal = true" />
</template>
<script>
import PageHeader from "./components/layout/PageHeader.vue";
import MsgModal from "./components/common/MsgModal.vue"
import PageFooter from "./components/layout/PageFooter.vue";
import { ref } from "vue";
export default {
    components: {
        PageHeader,
        PageFooter,
        MsgModal
    },
    setup() {
        const showModal = ref(false);
        return {
            showModal
        }
    }
}
</script>
