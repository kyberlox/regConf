<template>
    <EngineMark />
    <div class="summary">
        <div class="summary__container"
             :class="{ 'summary__container--open': showHelper }">
            <div v-for="item in mainQuestions"
                 :key="item.id"
                 :ref="el => questionRefs[item.inputName] = el">
                <CardCommon class="summary__card card mb-4"
                            :class="{ 'hidden': item.hidden }"
                            :question="item" />
            </div>
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
import { ref, computed, watch, onMounted } from "vue";
import { useHelperStore } from "@/store/helper";
import { useEnvModuleStore } from "@/store/envModule";
import { useQuestionsStore } from "@/store/questions";

import ArrowLeft from "@/assets/icons/ArrowLeft.vue";
import EngineMark from "../components/common/EngineMark.vue";
import Passport from "../components/common/FormEndPassport.vue";
import CardCommon from "@/components/common/CardCommon.vue";
import SideHelper from "@/components/common/SideHelper.vue";
import FormHandler from "@/components/FormHandler.vue";
import Api from "@/utils/Api";

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
        const helperStore = useHelperStore();
        const envModuleStore = useEnvModuleStore();
        const questionsStore = useQuestionsStore();

        const showHelper = ref(true);
        const questionRefs = ref({});
        const mainQuestions = computed(() => questionsStore.questions);
        const errors = computed(() => helperStore.getMessages);

        const questionInGroup = computed(() => helperStore.getQuestionsRef);

        onMounted(() => {
            helperStore.pushToRefGroup(questionRefs.value)
        })

        const goToQuestion = (name) => {
            questionInGroup.value[name]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };

        const handleErrorHighlight = (newErrors) => {
            Object.values(questionInGroup.value).forEach(element => {
                element.classList.remove('card--error-highlight');
            });

            if (newErrors.length > 1) {
                const target = newErrors[newErrors.length - 1].inputGroup ? newErrors[newErrors.length - 1].inputGroup : newErrors[newErrors.length - 1].inputName;
                if (!target.inputGroup) {
                    questionInGroup.value[target]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    questionInGroup.value[target]?.classList.add('card--error-highlight');
                }

                newErrors.forEach(error => {
                    if (error.id !== 0 && questionInGroup.value[error.inputName]) {
                        questionInGroup.value[error.inputName].classList.add('card--error-highlight');
                    }
                });
            }
        };

        watch(() => [...errors.value], handleErrorHighlight, { deep: true });

        onMounted(async () => {
            try {
                const data = await Api.get(API_URL + '/get_table');
                envModuleStore.setEnvValues(data);
            } catch (error) {
                console.error('Failed to fetch table data:', error);
            }
        });

        return {
            showHelper,
            mainQuestions,
            goToQuestion,
            questionRefs,
        };
    }
};
</script>