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
                            @change="saveValue($event.target.value, groupIndex, 'input')"
                            @saveNewValue="(value, unit) => saveValue(unit, groupIndex, 'input')" />
                <TextType v-if="part.type == 'TextType'"
                          :question="part"
                          :oneLine="true"
                          :inputText="question.value"
                          @input="saveValue($event.target.value, groupIndex, 'select')" />
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

        const modifier = props.question.modifiers?.find((mod) => conversions[mod]);
        if (modifier) {
            convert.value = conversions[modifier];
        }

        const questionStore = useQuestionsStore();
        const optionsCounter = ref(1);
        const optionsLimit = ref(false);
        const answer = ref({ id: null, value: null });
        // const currentInput = ref();
        const answers = ref([]);

        const saveValue = (value, groupIndex, type) => {
            if (!answers.value[groupIndex]) {
                answers.value[groupIndex] = { id: null, value: null };
            }
            if (type == 'input') {
                answers.value[groupIndex].id = value;
            } else if (type == 'select') {
                answers.value[groupIndex].value = value;
            }

            if (answers.value[groupIndex].id || answers.value[groupIndex].value) {
                emit("saveNewValue", props.question.inputName, answers.value[groupIndex], "oneLine", groupIndex);
            }
        }

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

        // watch(answer.value, (newVal) => {
        //     console.log(answer.value);

        //     if (newVal.id == '') {
        //         answer.value.id = '';
        //         answer.value.value = null;
        //     }
        //     emit("saveNewValue", props.question.inputName, answer.value, "oneLine", lineIndex.value);
        // })

        return {
            saveValue,
            cloneQuestion,
            removeLine,
            optionsLimit,
        };
    },
};
</script>