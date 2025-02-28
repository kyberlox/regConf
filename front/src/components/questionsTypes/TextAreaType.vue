<template>
    <div class="card-body__textarea__wrapper">
        <textarea class="form-control"
                  style="height: 70px; resize: none"
                  :name="'addReqarea' + question.inputName"
                  :placeholder="question.placeholder"
                  @input="saveNewValue(question.inputName, $event.target.value)"
                  :value="defaultValue" />
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const defaultValue = ref();
        onMounted(() => {
            if (props.question.value) {
                defaultValue.value = props.question.value;
            }
        })
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
