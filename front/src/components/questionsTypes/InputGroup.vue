<template>
    <div class="card__results-container">
        <div class="card__results__result-block"
             v-for="answer in question.answers"
             :key="answer.id"
             v-show="!answer.hidden"
             :ref="el => questionInGroup[answer.inputName] = el">
            <div class="card__results__result-title">
                {{ answer.name }}
            </div>
            <div class="card__results__result-value">
                <span class="card__results__result-value__number">
                    {{ answer.value }}</span>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, onMounted } from "vue";
import { useHelperStore } from "@/store/helper";
export default {
    props: ["question"],
    setup(props, { emit }) {
        const helperStore = useHelperStore();
        const questionInGroup = ref({});

        onMounted(() => {
            helperStore.pushToRefGroup(questionInGroup.value)
        })

        return {
            questionInGroup
        }
    }
}
</script>