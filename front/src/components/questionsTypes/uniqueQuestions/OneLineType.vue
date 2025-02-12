<template>
    <TransitionGroup name="list">
        <div class="card-body__inner--oneLine"
             v-for="(item, groupIndex) in question.inner"
             :key="'variant' + groupIndex">
            <div v-for="(part, index) in item"
                 :key="'variant-part' + index"
                 class="card-body__question card-body__question--oneLine"
                 :class="{ 'card-body__question--oneLine--input-first': question.modifiers && question.modifiers.includes('inputBeforeSelect') }">
                <SelectType v-if="part.type == 'SelectType'"
                            :question="part"
                            :selectedOptions="question.value"
                            @change="saveSelectText($event.target.value, groupIndex)"
                            @saveNewValue="(value, unit) => saveSelectText(unit, groupIndex)" />
                <TextType v-if="part.type == 'TextType'"
                          :question="part"
                          :oneLine="true"
                          :inputText="question.value"
                          @input="saveSelectValue($event.target.value, groupIndex)" />
            </div>
            <button v-if="(!question.modifiers || !question.modifiers.includes('noAddButton')) && groupIndex !== 0"
                    class="card-footer__button"
                    @click="removeLine(groupIndex)">-</button>
        </div>
    </TransitionGroup>

    <button v-if="!question.modifiers || !question.modifiers.includes('noAddButton') || optionsLimit"
            class="card-footer__button"
            :class="{ hidden: optionsLimit }"
            @click="cloneQuestion(question.id)">+</button>
</template>

<script>
import SelectType from "@/components/questionsTypes/SelectType.vue";
import TextType from "@/components/questionsTypes/TextType.vue";
import { changeToMpa } from "@/utils/changeToMpa";
import { changeToKgInHour } from "@/utils/changeToKgInHour";
import { useQuestionsStore } from "@/store/questions";
import { ref, watch } from "vue";

export default {
    components: {
        SelectType,
        TextType,
    },
    props: {
        question: {
            type: Object,
            required: true,
        },
    },
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const conversions = {
            convertToMpa: changeToMpa,
            convertToKg: changeToKgInHour,
        };
        const convert = ref(false);
        const lineIndex = ref(0);

        const modifier = props.question.modifiers?.find((mod) => conversions[mod]);
        if (modifier) {
            convert.value = conversions[modifier];
        }

        const questionStore = useQuestionsStore();
        const optionsCounter = ref(1);
        const optionsLimit = ref(false);
        const answer = ref({ id: null, value: null });
        const currentInput = ref();

        const saveSelectText = (value, groupIndex) => {
            lineIndex.value = groupIndex;
            answer.value.id = value;
            if (answer.value.value) {
                if (convert.value) {
                    answer.value.value = convert.value(answer.value.id, currentInput.value);
                }
                emit("saveNewValue", props.question.inputName, answer.value, "oneLine", groupIndex);
            }
        };
        const saveSelectValue = (value, groupIndex) => {
            lineIndex.value = groupIndex;
            currentInput.value = value;
            answer.value.value = value;

            if (answer.value.id) {
                if (convert.value) {
                    answer.value.value = convert.value(answer.value.id, currentInput.value);
                }
                emit("saveNewValue", props.question.inputName, answer.value, "oneLine", groupIndex);
            }
        };

        const cloneQuestion = () => {
            answer.value = { id: null, value: null };
            questionStore.cloneQuestion(props.question.id);
            optionsCounter.value++;

            if (optionsCounter.value >= props.question.optionsLimit) {
                optionsLimit.value = true;
            }
        };

        const removeLine = (groupIndex) => {
            questionStore.removeLine(props.question.inputName, groupIndex);
        };

        watch(answer.value, (newVal) => {
            if (newVal.id == '') {
                answer.value.id = '';
                answer.value.value = null;
                emit("saveNewValue", props.question.inputName, answer.value, "oneLine", lineIndex.value);
            }
        })

        return {
            saveSelectText,
            saveSelectValue,
            cloneQuestion,
            removeLine,
            optionsLimit,
        };
    },
};
</script>