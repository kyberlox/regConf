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
             @click="downloadHandle()">Документация</div>
        <div class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="">Создать общее ТКП</div>
        <!-- <div class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="download('OL')">Скачать ОЛ</div> -->
    </div>
    <FormHandler />
</template>

<script>
import { ref, computed } from "vue";
import { usePageStore } from "@/store/page";
import { useQuestionsStore } from "@/store/questions";
import { useEnvModuleStore } from "@/store/envModule";
import { useHelperStore } from "@/store/helper";
import { useUserStore } from "@/store/user";
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
        const userStore = useUserStore();
        const showHelper = ref(true);
        const mainQuestions = computed(() => questionsStore.questions);
        const isAutorize = computed(() => userStore.getAutorizeStatus);
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

        const downloadHandle = () => {
            if (!jsonError.value) {
                const dataToSend = computed(() => envModuleStore.getAfterGetCompoundValue);
                if (isAutorize.value) {
                    Api.post(
                        API_URL + '/generate',
                        [dataToSend.value],
                        true
                    )
                }
                Api.post(
                    API_URL + '/makeOL',
                    dataToSend.value,
                    true
                )
            }
            else {
                helperStore.setErrorMessage(jsonError.value, 'emptyValueError');
            }
        }

        return {
            showHelper,
            mainQuestions,
            goToQuestion,
            downloadHandle,
            checkForDownload,
            jsonError
        };
    }
};
</script>