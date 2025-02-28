<template>
    <div v-show="!question.modifiers"
         v-for="questionInfo in question.answers"
         :key="questionInfo.value"
         class="form-check">
        <input @change="saveNewValue($event, question.inputName)"
               :name="question.inputName"
               :type="'checkbox'"
               :id="question.inputName + questionInfo.value"
               value=false
               :checked="question.value"
               :disabled="question.disabled"
               class="form-check-input card-body__radio" />
        <label :for="question.inputName + questionInfo.value"
               class="form-check-label card-body__radio-label">{{ questionInfo.name }}</label>
    </div>
    <div v-if="question.modifiers?.includes('checkboxGroup')">
        <div class="checkbox-group">
            <div v-for="questionInfo in question.answers"
                 :key="questionInfo.inputName"
                 class="form-check">

                <input @change="saveNewValue($event, question.inputName, questionInfo.inputName)"
                       :name="questionInfo.inputName"
                       :type="'checkbox'"
                       :id="questionInfo.inputName"
                       class="form-check-input card-body__radio" />
                <label :for="questionInfo.inputName"
                       class="form-check-label card-body__radio-label">{{ questionInfo.name }}</label>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useQuestionsStore } from "@/store/questions";
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const groupValue = ref([]);
        const questionsStore = useQuestionsStore();
        const isGroup = ref(props.question.modifiers?.includes('checkboxGroup'));

        const saveNewValue = (event, name, inputName) => {
            if (!isGroup.value) {
                emit("saveNewValue", name, event.target.checked);
            } else {
                questionsStore.setQuestionValue(inputName, event.target.checked, 'inputGroup', false, 'additionalAnswersGroup');
                emit("saveNewValue", name, groupValue.value);
            }
        }

        return {
            saveNewValue,
        }
    }
}
</script>