<template>
    <div v-for="questionInfo in question.answers"
         :key="questionInfo.value"
         class="form-check">
        <input @change="sendFormBack({ [question.inputName + questionInfo.value]: true })"
               :name="question.inputName"
               :type="'checkbox'"
               :id="question.inputName + questionInfo.value"
               class="form-check-input card-body__radio" />
        <label :for="question.inputName + questionInfo.value"
               class="form-check-label card-body__radio-label">{{ questionInfo.name }}</label>
    </div>
</template>

<script>
export default {
    props: ["question"],
    emits: ["sendFormBack"],
    setup(props, { emit }) {
        const sendFormBack = (radioValue) => {
            emit("sendFormBack", radioValue);
        }
        return {
            sendFormBack
        }
    }
}
</script>