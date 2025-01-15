<template>
    <div class="helper__wrapper">
        <div class="helper">
            <p>Помощь</p>
            <div class="helper__content">
                <div class="helper__message">
                    {{ message }}
                </div>
            </div>
        </div>
        <div class="helper__close-icon__wrapper">
            <Cancel @click="closeCalcParams"
                    class="helper__close-icon" />
        </div>
    </div>
</template>

<script>
import Cancel from "@/assets/icons/Cancel.vue";
import { useHelperStore } from "@/store/helper";
import { computed } from "vue";
export default {
    props: {
        questions: {
            type: Array,
            required: true
        }
    },
    components: {
        Cancel,
    },
    emits: ["closeCalcParams"],
    setup(props, { emit }) {
        const helperStore = useHelperStore();
        return {
            closeCalcParams: () => emit("closeCalcParams"),
            isLoading: false,
            message: computed(() => helperStore.getMessage)
        }
    }
}
</script>
