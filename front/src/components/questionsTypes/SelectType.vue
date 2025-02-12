<template>
    <div class="card-body__select__wrapper">
        <select :name="question.inputName"
                :id="question.inputName"
                :key="question.answers.length"
                class="card-body__select"
                :value="selectValue"
                @change="saveNewValue(question.inputName, $event.target.value)">
            <option disabled
                    selected
                    value="">Выберите из списка</option>
            <option v-for="answer in question.answers"
                    :key="question.answers.indexOf(answer) + answer"
                    :value="answer.id ? answer.id : answer.value"
                    :disabled="checkDuplicate(question.answers.indexOf(answer) + 1)">
                {{ typeof answer == "object" ? answer.name : answer }}
            </option>
        </select>
    </div>
</template>

<script>
import { watch, onMounted, ref } from 'vue';
export default {
    props: ["question", "selectedOptions"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const selectValue = ref();

        const saveNewValue = (name, value) => {
            selectValue.value = value;
            emit("saveNewValue", name, value);
        }

        onMounted(() => {
            selectValue.value = props.question.defaultValue;
            saveNewValue(props.question.inputName, selectValue.value);
        })

        watch(() => props.question.answers.length, () => {
            saveNewValue(props.question.inputName, null);
        })

        const checkDuplicate = (id) => {
            if (props.selectedOptions) {
                return props.selectedOptions.some(item => item.id == id);
            }
            return false;
        }

        return {
            saveNewValue,
            checkDuplicate,
            selectValue
        }
    }
};
</script>