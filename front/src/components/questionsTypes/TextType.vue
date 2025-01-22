<template>
    <input class="card-body__input"
           :name="question.inputName"
           :placeholder="question.placeholder"
           @input="saveNewValue(question.inputName, $event.target.value)" />
</template>

<script>
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const saveNewValue = (name, value) => {
            emit("saveNewValue", name, value);
        }
        return {
            saveNewValue
        }
    }
}
</script>
