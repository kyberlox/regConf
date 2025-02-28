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
            <DisabledType v-if="debug && (question.convertedValue && question.modifiers.includes('convertToKg') || question.modifiers.includes('convertToMpa'))"
                          :question="question.convertedValue" />
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

import { useQuestionsStore } from "@/store/questions";
import { usePageStore } from "@/store/page";
import { ref, computed } from "vue";
import DisabledType from "@/components/questionsTypes/DisabledType.vue";

export default {
    components: {
        SelectType,
        TextType,
        DisabledType
    },
    props: {
        question: {
            type: Object,
            required: true,
        },
    },
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const questionStore = useQuestionsStore();
        const optionsCounter = ref(1);
        const optionsLimit = ref(false);
        const answers = ref([]);
        const debug = computed(() => usePageStore().debugMode);

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
            questionStore.cloneQuestion(props.question.id);
            optionsCounter.value++;

            if (optionsCounter.value >= props.question.optionsLimit) {
                optionsLimit.value = true;
            }
        };

        const removeLine = (groupIndex) => {
            questionStore.removeLine(props.question.inputName, groupIndex);
        };

        return {
            saveValue,
            cloneQuestion,
            removeLine,
            optionsLimit,
            debug
        };
    },
};
</script>