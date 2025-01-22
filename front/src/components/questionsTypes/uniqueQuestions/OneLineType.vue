<template>
    <TransitionGroup name="list">
        <div class="card-body__inner--oneLine"
             v-for="(item, groupIndex) in envTypeVariants"
             :key="'variant' + groupIndex">
            <div v-for="(part, index) in item"
                 :key="'variant-part' + index"
                 class="card-body__question card-body__question--oneLine"
                 :class="{ 'card-body__question--oneLine--input-first': question.modifiers && question.modifiers.includes('inputBeforeSelect') }">
                <SelectType v-if="part.type == 'SelectType'"
                            :question="part"
                            @change="saveSelectText($event.target.value, groupIndex)" />
                <TextType v-if="part.type == 'TextType'"
                          :question="part"
                          @input="saveSelectValue($event.target.value, groupIndex)" />
            </div>
            <button v-if="(!question.modifiers || !question.modifiers.includes('noAddButton')) && groupIndex !== 0"
                    class="card-footer__button"
                    @click="removeLine(groupIndex)">-</button>
        </div>
    </TransitionGroup>

    <button v-if="!question.modifiers || !question.modifiers.includes('noAddButton')"
            class="card-footer__button"
            @click="cloneQuestion(question.id)">+</button>
</template>

<script>
import SelectType from "@/components/questionsTypes/SelectType.vue";
import TextType from "@/components/questionsTypes/TextType.vue";
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
        const questionStore = useQuestionsStore();

        const answer = ref({ id: null, value: null });
        const saveSelectText = (value, groupIndex) => {
            answer.value.id = value;
            if (answer.value.value) {
                emit("saveNewValue", props.question.inputName, answer.value, true, groupIndex);
            }
        };
        const saveSelectValue = (value, groupIndex) => {
            answer.value.value = value;
            if (answer.value.id) {
                emit("saveNewValue", props.question.inputName, answer.value, true, groupIndex);
            }
        };

        const envTypeVariants = ref(props.question.inner);

        const cloneQuestion = () => {
            questionStore.cloneQuestion(props.question.id);
        }

        const removeLine = (groupIndex) => {
            questionStore.removeLine(props.question.inputName, groupIndex);
        }

        return {
            saveSelectText,
            saveSelectValue,
            envTypeVariants,
            cloneQuestion,
            removeLine
        };
    },
};
</script>