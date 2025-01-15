<template>
    <input class="card-body__input"
           :name="question.inputName"
           :placeholder="question.placeholder"
           @input="sendFormBack({ [question.inputName]: $event.target.value })" />
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