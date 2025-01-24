<template>
    <div class="card-body__select__wrapper">
        <select @change="saveNewValue(question.inputName, $event.target.value)"
                :name="question.inputName"
                :id="question.inputName"
                :key="question.answers.length"
                class="card-body__select">
            <option disabled
                    selected
                    value="">Выберите из списка</option>
            <option :value="answer.id"
                    v-for="answer in question.answers"
                    :key="question.answers.indexOf(answer)"
                    :class="{ hidden: checkDuplicate(answer.id) }">
                {{ typeof answer == "object" ? answer.name : answer }}
            </option>
        </select>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const chosenOptions = ref([]);

        const saveNewValue = (name, value) => {
            emit("saveNewValue", name, value);
            chosenOptions.value.push(name);
            console.log(chosenOptions.value);
        }

        const checkDuplicate = (id) => {

            return chosenOptions.value.includes(id);
        }

        return {
            saveNewValue,
            chosenOptions,
            checkDuplicate
        }
    }
};
</script>
