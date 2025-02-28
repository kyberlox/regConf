<template>
    <div class="card-body__select__wrapper">
        <select :name="question.inputName"
                :id="question.inputName"
                :key="'select' + question.id"
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
import { usePageStore } from '@/store/page';
export default {
    props: ["question", "selectedOptions"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        const selectValue = ref();

        const saveNewValue = (name, value) => {
            selectValue.value = value;
            emit("saveNewValue", name, value);
        }

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
            selectValue.value = props.question.defaultValue;
            saveNewValue(props.question.inputName, selectValue.value);
        })

        watch(() => props.question.answers, (newVal, oldVal) => {
            if (Array.isArray(newVal) && Array.isArray(oldVal) && newVal.length !== oldVal.length) {
                saveNewValue(props.question.inputName, '');
            }
        })

        watch(() => props.question.value, (newValue) => {
            selectValue.value = newValue;
        });

        const checkDuplicate = (id) => {
            if (props.selectedOptions) {
                return props.selectedOptions.some(item => item.id == id);
            }
            return false;
        }

        return {
            saveNewValue,
            checkDuplicate,
            selectValue,
            questionInGroup
        }
    }
};
</script>
