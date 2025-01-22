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
                    :key="question.answers.indexOf(answer)">
                {{ typeof answer == "object" ? answer.name : answer }}
            </option>
        </select>
    </div>
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
};
</script>
