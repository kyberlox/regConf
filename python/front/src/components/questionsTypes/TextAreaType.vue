<template>
    <div :ref="el => questionInGroup[question.inputName] = el">
        <textarea class="form-control"
                  style="height: 70px; resize: none"
                  :name="'addReqarea' + question.inputName"
                  :placeholder="question.placeholder"
                  @input="saveNewValue(question.inputName, $event.target.value)"
                  :value="defaultValue" />
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
        const defaultValue = ref();

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const saveNewValue = (name, value) => {
            defaultValue.value = value;
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
