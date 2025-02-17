<template>
    <EngineMark />
    <div class="summary">
        <div class="summary__container"
             :class="{ 'summary__container--open': showHelper }">

            <CardCommon v-for="item in mainQuestions"
                        :key="item.id"
                        class="summary__card card mb-4"
                        :class="{ 'hidden': item.hidden }"
                        :question="item"
                        @checkDownloadJson="checkForDownload" />
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
    <!-- <Passport /> -->
    <div class="download-button__wrapper">
        <div class="download-button"
             @click="download('TKP')">Скачать ТКП</div>
        <div class="download-button"
             @click="download('OL')">Скачать ОЛ</div>
    </div>
    <FormHandler />
</template>

<script>
import { ref, computed } from "vue";
import { usePageStore } from "@/store/page";
import { useQuestionsStore } from "@/store/questions";
import { useEnvModuleStore } from "@/store/envModule";
import Validator from "@/utils/Validator";

import ArrowLeft from "@/assets/icons/ArrowLeft.vue";
import EngineMark from "../components/common/EngineMark.vue";
import CardCommon from "@/components/common/CardCommon.vue";
import SideHelper from "@/components/common/SideHelper.vue";
import FormHandler from "@/components/FormHandler.vue";
import Api from "@/utils/Api";

export default {
    components: {
        EngineMark,
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
        const envModuleStore = useEnvModuleStore();
        const jsonToDownload = computed(() => envModuleStore.getAfterGetCompoundValue);
        const jsonReady = ref(false);
        console.log(jsonToDownload);


        const goToQuestion = (name) => {
            pageStore.goToQuestion(name)
        }

        const checkForDownload = () => {
            console.log('ds');

            if (typeof jsonToDownload.value == 'object' && jsonToDownload.value.length) {
                jsonReady.value = Validator.validDownloadJson(jsonToDownload.value);
            }
        }

        const download = (type) => {
            const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);
            if (type == 'TKP') {
                Api.post(
                    API_URL + '/generate',
                    [dataToSend.value],
                    true
                )
            } else if (type == 'OL') {
                Api.post(
                    API_URL + '/makeOL',
                    dataToSend.value,
                    true
                )
            }
        }

        return {
            showHelper,
            mainQuestions,
            goToQuestion,
            download,
            checkForDownload,
            jsonReady
        };
    }
};
</script>
<style lang="scss">
.download-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 230px;
    height: 60px;
    // margin: auto;
    background-color: white;
    border: 2px solid var(--emk-brand-color);
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);

    &:hover {
        color: var(--emk-brand-color);
        transform: translateY(-2px);
        box-shadow: 0 0.7rem 1.5rem rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.1);
    }

    &__wrapper {
        padding-bottom: 30px;
        display: flex;
        justify-content: center;
        gap: 30px;
    }
}
</style>