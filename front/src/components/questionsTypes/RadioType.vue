<template>
    <div v-for="questionInfo in question.answers"
         :key="questionInfo.value"
         class="form-check">
        <input @click="saveNewValue(question.inputName, questionInfo.value)"
               :name="question.inputName"
               :type="'radio'"
               :id="question.inputName + questionInfo.value"
               :value="questionInfo.value"
               :checked="question.value === questionInfo.value"
               class="form-check-input card-body__radio" />
        <label :for="question.inputName + questionInfo.value"
               class="form-check-label card-body__radio-label">{{ questionInfo.name }}</label>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { usePageStore } from "@/store/page";
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const saveNewValue = (name, value) => {
            emit("saveNewValue", name, value);
        }
        return {
            saveNewValue,
            questionInGroup
        }
    }
}
</script>