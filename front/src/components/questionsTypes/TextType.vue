<template>
    <div class="card-body__input__wrapper">
        <input class="card-body__input"
               :name="question.inputName"
               :placeholder="question.placeholder"
               :type="question.inputType"
               @input="saveNewValue(question.inputName, $event.target.value)"
               :value="defaultValue" />
    </div>
</template>

<script>
import { ref, watch } from 'vue';
export default {
    props: ["question", "inputText", "oneLine"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const defaultValue = ref();

        watch(() => props.inputText, (newValue) => {
            if ((newValue && props.oneLine && newValue[0].value == null) || newValue == null) {
                saveNewValue(props.question.inputName, null)
            }
        }, { deep: true });

        watch(() => props.question.value, (newVal) => {
            if (newVal == null) {
                defaultValue.value = null;
            }
        }, { deep: true })

        const saveNewValue = (name, value) => {
            defaultValue.value = value;
            emit("saveNewValue", name, value);
        }
        return {
            saveNewValue,
            defaultValue,
        }
    }
}
</script>
