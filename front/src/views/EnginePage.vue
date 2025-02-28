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
        <!-- <div v-if="isAuthorize"
             class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="downloadHandle(docName, 'download')">Скачать</div> -->

        <div v-if="!isAuthorize"
             class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="downloadHandle(docName, 'singleDownload')">Скачать</div>

        <div v-else
             class="download-button"
             :class="{ 'download-button--disabled': jsonError }"
             @click="!jsonError ? addNewPos() : ''">Продолжить</div>
    </div>
    <MsgModal v-if="showModal"
              :type="modalType"
              :modalActive="showModal"
              @closeModal="closeModal"
              @modalHandle="(name, type) => modalHandle(name, type)" />
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
import MsgModal from "@/components/common/MsgModal.vue";

export default {
    components: {
        EngineMark,
        SideHelper,
        ArrowLeft,
        CardCommon,
        MsgModal
    },
    setup(props, { emit }) {
        const stores = useStores();
        const showHelper = ref(true);
        const showModal = ref(false);
        const mainQuestions = computed(() => stores.questionsStore.questions);
        const { jsonError, downloadHandle, checkForDownload } = useDownload(stores);
        const goToQuestion = (name) => {
            stores.pageStore.goToQuestion(name)
        }

        const closeModal = () => showModal.value = false

        const addNewPos = () => {
            // emit('addNewPos');
            showModal.value = true;
        }

        const modalHandle = (name, type) => {
            if (jsonError.value) { return }
            stores.envModuleStore.pushToTkp();

            // if (type == 'download') {
            // }
            if (type == 'add') {
                stores.questionsStore.resetQuestionGroup('all');
                stores.pageStore.goToQuestion('environmentType');
                // checkForDownload();
            }
            // else if (type == 'singleDownload') {
            //     downloadHandle(name, type)
            // }
            closeModal();
            downloadHandle(name, type);
        }

        formParamsHandle(stores);

        return {
            showHelper,
            mainQuestions,
            jsonError,
            goToQuestion,
            downloadHandle,
            checkForDownload,
            isAuthorize: computed(() => stores.userStore.getAutorizeStatus),
            docName: computed(() => stores.questionsStore.getMark),
            addNewPos,
            modalType: 'download',
            showModal,
            closeModal,
            modalHandle
        };
    }
};
</script>