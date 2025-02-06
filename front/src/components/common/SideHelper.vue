<template>
    <div class="helper__wrapper">
        <div class="helper">
            <div class="helper__title">Помощь</div>
            <div class="helper__content">
                <TransitionGroup name="slide-down">
                    <div class="helper__message"
                         v-for="(message, index) in messages"
                         :key="'message' + index"
                         @click="goToQuestion(message.inputName)">
                        {{ message.text }}
                    </div>
                </TransitionGroup>

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
    components: {
        Cancel,
    },
    emits: ["closeCalcParams", "goToQuestion"],
    setup(props, { emit }) {
        const helperStore = useHelperStore();
        const goToQuestion = (name) => {
            if (name)
                emit('goToQuestion', name)
        }
        return {
            closeCalcParams: () => emit("closeCalcParams"),
            goToQuestion,
            isLoading: false,
            messages: computed(() => helperStore.getMessages)
        }
    }
}
</script>