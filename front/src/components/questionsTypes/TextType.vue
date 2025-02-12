<template>
    <div :ref="el => questionInGroup[question.inputName] = el">
        <input class="card-body__input"
               :name="question.inputName"
               :placeholder="question.placeholder"
               @input="saveNewValue(question.inputName, $event.target.value)"
               v-model="defaultValue" />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { usePageStore } from "@/store/page";
export default {
    props: ["question"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const defaultValue = ref(props.question.value);
        const saveNewValue = (name, value) => {
            emit("saveNewValue", name, value);
        }
        return {
            saveNewValue,
            defaultValue,
            questionInGroup
        }
    }
}
</script>
