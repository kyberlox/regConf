<template>
    <EngineMark />
    <div class="summary">
        <div class="summary__container"
             :class="{ 'summary__container--open': showHelper }">

            <CardCommon v-for="item in mainQuestions"
                        :key="item.id"
                        class="summary__card card mb-4"
                        :class="{ 'hidden': item.hidden }"
                        :question="item" />
        </div>

        <transition name="slide">
            <SideHelper @closeCalcParams="showHelper = false"
                        v-if="showHelper"
                        @goToQuestion="goToQuestion" />
            <ArrowLeft v-else
                       @click="showHelper = true"
                       class="summary__arrow-icon" />
        </transition>
    </div>
    <Passport />
    <FormHandler />
</template>

<script>
import { ref, computed } from "vue";
import { usePageStore } from "@/store/page";
import { useQuestionsStore } from "@/store/questions";

import ArrowLeft from "@/assets/icons/ArrowLeft.vue";
import EngineMark from "../components/common/EngineMark.vue";
import Passport from "../components/common/FormEndPassport.vue";
import CardCommon from "@/components/common/CardCommon.vue";
import SideHelper from "@/components/common/SideHelper.vue";
import FormHandler from "@/components/FormHandler.vue";

export default {
    components: {
        EngineMark,
        Passport,
        SideHelper,
        ArrowLeft,
        CardCommon,
        FormHandler
    },

    setup() {
        const questionsStore = useQuestionsStore();
        const pageStore = usePageStore();
        const showHelper = ref(true);
        const mainQuestions = computed(() => questionsStore.questions);

        const goToQuestion = (name) => {
            pageStore.goToQuestion(name)
        }

        return {
            showHelper,
            mainQuestions,
            goToQuestion
        };
    }
};
</script>