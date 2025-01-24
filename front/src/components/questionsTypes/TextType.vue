<template>
    <input class="card-body__input"
           :name="question.inputName"
           :placeholder="question.placeholder"
           @input="saveNewValue(question.inputName, $event.target.value)"
           v-model="defaultValue" />
</template>

<script>
import { ref } from 'vue';
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const defaultValue = ref(props.question.value);
        const saveNewValue = (name, value) => {
            emit("saveNewValue", name, value);
        }
        return {
            saveNewValue,
            defaultValue
        }
    }
}
</script>
