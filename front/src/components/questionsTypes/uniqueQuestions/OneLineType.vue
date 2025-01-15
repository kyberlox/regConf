<template>
    <TransitionGroup name="list">
        <div class="card-body__inner--oneLine"
             v-for="(item, index) in envTypeVariants"
             :key="'variant' + index">
            <div v-for="(part, index) in item"
                 :key="'variant-part' + index"
                 class="card-body__question card-body__question--oneLine"
                 :class="{ 'card-body__question--oneLine--input-first': question.modifiers && question.modifiers.includes('inputBeforeSelect') }">
                <SelectType v-if="part.type == 'SelectType'"
                            :question="part" />
                <TextType v-if="part.type == 'TextType'"
                          :question="part" />
            </div>
        </div>
    </TransitionGroup>

    <button v-if="!question.modifiers || !question.modifiers.includes('noAddButton')"
            class="card-footer__button"
            @click="cloneQuestion()">+</button>
</template>

<script>
import SelectType from "@/components/questionsTypes/SelectType.vue";
import TextType from "@/components/questionsTypes/TextType.vue";
import { ref } from "vue";

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
    emits: ["sendFormBack"],
    setup(props, { emit }) {
        const sendFormBack = (radioValue) => {
            emit("sendFormBack", radioValue);
        };

        const envTypeVariants = ref(props.question.inner);

        const cloneQuestion = () => {
            console.log(props.question.inner);

            envTypeVariants.value.push(envTypeVariants.value[0]);
        }

        return {
            sendFormBack,
            envTypeVariants,
            cloneQuestion
        };
    },
};
</script>