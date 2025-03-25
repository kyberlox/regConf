<template>
    <div class="form-group">
        <div class="card-header"
             :class="{ 'card-header__input-block': question.type !== 'inputGroup' }"
             :ref="el => questionInGroup[question.inputName] = el"
             v-if="question.id || question.name">
            <h5 class="mb-0">{{ question.id ? question.id + ')' : '' }} {{ question.name }}</h5>
        </div>
        <div class="card-body">
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
import { changeToMpa } from "@/utils/changeToMpa";
import { changeToKgInHour } from "@/utils/changeToKgInHour";

import { useQuestionsStore } from "@/store/questions";
import TextAreaType from "../questionsTypes/TextAreaType.vue";
import { computed, ref, onMounted } from "vue";
import { usePageStore } from "@/store/page";
import { findQuestion } from "@/utils/findQuestionInStore"
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
        const convertedValue = ref({ value: '' });

        const conversions = {
            convertToMpa: changeToMpa,
            convertToKg: changeToKgInHour,
        };
        const convert = ref(null);

        const modifier = props.question.modifiers?.find((mod) => conversions[mod]);
        if (modifier) {
            convert.value = conversions[modifier];
        }

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const questionsStore = useQuestionsStore();

        const saveNewValue = (name, value, oneLine = false, subquestionId = null) => {
            if (name == 'Pn' || name == 'Pp' || name == 'Pp_din') {
                convertedValue.value = { id: value.id, value: convert.value(value.id, value.value) };
                questionsStore.setConvertedValue(name, convertedValue.value);
            }
            else if (name == 'Gab') {
                if (value.id == 'Нм3/час') {
                    convertedValue.value = { id: value.id, value: convert.value(value.id, value.value, findQuestion('envAnswersGroup', 'density_ns').value) };
                }
                else {
                    convertedValue.value = { id: value.id, value: convert.value(value.id, value.value) };
                }
                questionsStore.setConvertedValue(name, convertedValue.value);
            }

            questionsStore.setQuestionValue(name, value, oneLine, subquestionId);
            emit('checkDownloadJson');
        }

        return {
            saveNewValue,
            debugMode: computed(() => pageStore.debugMode),
            questionInGroup,
        }
    }
}
</script>