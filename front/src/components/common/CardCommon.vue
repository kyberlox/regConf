<template>
    <div class="form-group">
        <div class="card-header"
             v-if="question.id && question.name">
            <h5 class="mb-0">{{ question.id }}) {{ question.name }}</h5>
        </div>
        <div class="card-body">
            <component :is="question.type"
                       :question="question" />
        </div>
    </div>
</template>
<script>
import SelectType from "@/components/questionsTypes/SelectType.vue";
import RadioType from "@/components/questionsTypes/RadioType.vue";
import TextType from "@/components/questionsTypes/TextType.vue";
import CheckboxType from "@/components/questionsTypes/CheckboxType.vue";
import OneLineType from "../questionsTypes/uniqueQuestions/OneLineType.vue";
import DisabledType from "../questionsTypes/DisabledType.vue";
export default {
    props: {
        question: {
            type: Object,
            required: true,
        }
    },
    components: {
        SelectType,
        RadioType,
        TextType,
        CheckboxType,
        OneLineType,
        DisabledType
    },
    setup() {
        return {

        }
    }
}
</script>