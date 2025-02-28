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
             @click="''">Создать общее ТКП</div>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import ArrowLeft from "@/assets/icons/ArrowLeft.vue";
import EngineMark from "../components/common/EngineMark.vue";
import CardCommon from "@/components/common/CardCommon.vue";
import SideHelper from "@/components/common/SideHelper.vue";

import { formParamsHandle } from "@/composables/formParamsHandle";
import { useStores } from "@/composables/useStores";
import { useDownload } from "@/composables/useDownload";

export default {
    components: {
        EngineMark,
        SideHelper,
        ArrowLeft,
        CardCommon,
    },
    setup() {
        const stores = useStores();
        const showHelper = ref(true);
        const mainQuestions = computed(() => stores.questionsStore.questions);
        const { jsonError, downloadHandle, checkForDownload } = useDownload(stores);
        const goToQuestion = (name) => {
            stores.pageStore.goToQuestion(name)
        }

        formParamsHandle(stores);

        return {
            showHelper,
            mainQuestions,
            jsonError,
            goToQuestion,
            downloadHandle,
            checkForDownload,
        };
    }
};
</script>