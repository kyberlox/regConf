<template>
    <div :ref="el => questionInGroup[question.inputName] = el">
        <input class="card-body__input"
               :name="question.inputName"
               :placeholder="question.placeholder"
               @input="saveNewValue(question.inputName, $event.target.value)"
               :value="defaultValue" />
    </div>
</template>

<script>
import { ref, onMounted, watch, watchEffect } from 'vue';
import { usePageStore } from "@/store/page";
export default {
    props: ["question", "inputText", "fullquestion"],
    emits: ["saveNewValue"],
    setup(props, { emit }) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        onMounted(() => {
            if (questionInGroup.value) {
                pageStore.pushToRefGroup(questionInGroup.value)
            }
        })

        const defaultValue = ref();

        watch(() => props.inputText, (newValue) => {
            if (newValue && props.fullquestion) {
                if (newValue[0].value == null) {
                    saveNewValue(props.question.inputName, '')
                    defaultValue.value = null;
                }
            }
            else {
                if (newValue == null) {
                    saveNewValue(props.question.inputName, null)
                    defaultValue.value = null;
                }
            }

            // if (props.fullquestion && (newValue == null || newValue.length == 0 || props.inputText[0] == null)) {
            //     saveNewValue(props.question.inputName, '')
            //     console.log('1');

            // } else if (typeof newValue == 'object' && newValue?.length) {

            //     console.log('2');

            //     saveNewValue(props.question.inputName, null)

            //     defaultValue.value = newValue[0].value;

            // } else {
            //     console.log('3');
            //     defaultValue.value = newValue;
            // }
        }, { deep: true });

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
