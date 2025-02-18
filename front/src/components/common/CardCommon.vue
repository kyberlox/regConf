<template>
    <div class="form-group">
        <div class="card-header"
             v-if="question.id || question.name">
            <h5 class="mb-0">{{ question.id ? question.id + ')' : '' }} {{ question.name }}</h5>
        </div>
        <div class="card-body"
             :ref="el => questionInGroup[question.inputName] = el">
            <component :is="question.type"
                       :question="question"
                       @saveNewValue="saveNewValue" />
            <div v-if="debugMode">
                <span> {{ question.value }}</span>
                <br />
                <span> {{ question.inputName }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import SelectType from "@/components/questionsTypes/SelectType.vue";
import RadioType from "@/components/questionsTypes/RadioType.vue";
import TextType from "@/components/questionsTypes/TextType.vue";
import CheckboxType from "@/components/questionsTypes/CheckboxType.vue";
import OneLineType from "../questionsTypes/uniqueQuestions/OneLineType.vue";
import InputGroup from "../questionsTypes/InputGroup.vue";

import { useQuestionsStore } from "@/store/questions";
import TextAreaType from "../questionsTypes/TextAreaType.vue";
import { computed, ref, onMounted } from "vue";
import { usePageStore } from "@/store/page";
export default {
    props: {
        question: {
            type: Object,
            required: true,
        }
    },
    emits: ['checkDownloadJson'],
    components: {
        SelectType,
        RadioType,
        TextType,
        CheckboxType,
        OneLineType,
        InputGroup,
        TextAreaType
    },
    setup(props, { emit }) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const questionsStore = useQuestionsStore();
        const saveNewValue = (name, value, oneLine = false, subquestionId = null) => {
            if (oneLine == true) {
                console.log(name);
                console.log(value);
                console.log(subquestionId);
            }
            questionsStore.setQuestionValue(name, value, oneLine, subquestionId);
            emit('checkDownloadJson');
        }

        return {
            saveNewValue,
            debugMode: computed(() => pageStore.debugMode),
            questionInGroup
        }
    }
}
</script>