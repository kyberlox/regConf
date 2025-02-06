<template>
    <div v-for="questionInfo in question.answers"
         :key="questionInfo.value"
         class="form-check">
        <input @change="saveNewValue($event, question.inputName)"
               :name="question.inputName"
               :type="'checkbox'"
               :id="question.inputName + questionInfo.value"
               :value="questionInfo.value"
               :checked="question.value"

               class="form-check-input card-body__radio" />
        <label :for="question.inputName + questionInfo.value"
               class="form-check-label card-body__radio-label">{{ questionInfo.name }}</label>
    </div>
</template>

<script>
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const saveNewValue = (event, name) => {
            emit("saveNewValue", name, event.target.checked);
        }
        return {
            saveNewValue
        }
    }
}
</script>