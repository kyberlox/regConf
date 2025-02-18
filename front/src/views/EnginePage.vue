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
    <div class="download-button__wrapper">
        <div class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="download('TKP')">Скачать ТКП</div>
        <div class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="download('OL')">Скачать ОЛ</div>
    </div>
    <FormHandler />
</template>

<script>
import { ref, computed } from "vue";
import { usePageStore } from "@/store/page";
import { useQuestionsStore } from "@/store/questions";
import { useEnvModuleStore } from "@/store/envModule";
import { useHelperStore } from "@/store/helper";
import Validator from "@/utils/Validator";

import ArrowLeft from "@/assets/icons/ArrowLeft.vue";
import EngineMark from "../components/common/EngineMark.vue";
import CardCommon from "@/components/common/CardCommon.vue";
import SideHelper from "@/components/common/SideHelper.vue";
import FormHandler from "@/components/FormHandler.vue";
import Api from "@/utils/Api";
import { watch } from "vue";

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
        const helperStore = useHelperStore();
        const jsonError = ref(false);

        const goToQuestion = (name) => {
            pageStore.goToQuestion(name)
        }

        const checkForDownload = () => {
            jsonError.value = Validator.validDownloadJson(mainQuestions.value, helperStore);
        }

        watch(() => jsonError, (oldVal, newVal) => {
            if (newVal && oldVal !== false) {
                helperStore.deleteErrorMessage(null, 'emptyValueError');
            }
        }, { deep: true })

        const download = (type) => {
            if (!jsonError.value) {
                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);
                switch (type) {
                    case 'TKP':
                        Api.post(
                            API_URL + '/generate',
                            [dataToSend.value],
                            true
                        )
                        break;
                    case 'OL':
                        Api.post(
                            API_URL + '/makeOL',
                            dataToSend.value,
                            true
                        )
                        break;
                }
            } else {
                helperStore.setErrorMessage(jsonError.value, 'emptyValueError');
            }
        }

        return {
            showHelper,
            mainQuestions,
            goToQuestion,
            download,
            checkForDownload,
            jsonError
        };
    }
};
</script>