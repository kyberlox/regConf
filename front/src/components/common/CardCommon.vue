<template>
    <div class="form-group">
        <div class="card-header"
             v-if="question.id || question.name">
            <h5 class="mb-0">{{ question.id ? question.id + ')' : '' }} {{ question.name }}</h5>
        </div>
        <div class="card-body">
            <component :is="question.type"
                       :question="question"
                       v-bind="question.type === 'TextType' ? { inputText: question.value } : {}"
                       @saveNewValue="saveNewValue" />
            <!-- {{ question.value }} -->
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
        const questionsStore = useQuestionsStore();
        const saveNewValue = (name, value, oneLine = false, subquestionId = null) => {
            questionsStore.setQuestionValue(name, value, oneLine, subquestionId);
            emit('checkDownloadJson');
        }

        return {
            saveNewValue,
        }
    }
}
</script>