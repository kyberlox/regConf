<template>
    <div class="card__results-container">
        <div class="card__results__result-block"
             v-for="answer in question.answers"
             :key="answer.id"
             :class="{ 'hidden': answer.hidden }"
             :ref="el => questionInGroup[answer.inputName] = el">
            <div class="card__results__result-title">
                {{ answer.name }}
            </div>
            <div class="card__results__result-value">
                <span class="card__results__result-value__number"
                      :class="{ 'card__results__result-value__number--min-font': answer.inputName == 'trials' }"
                      v-html="answer.value">
                </span>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, onMounted } from "vue";
import { usePageStore } from "@/store/page";
export default {
    props: ["question"],
    setup(props) {
        const pageStore = usePageStore();
        const questionInGroup = ref({});

        onMounted(() => {
            pageStore.pushToRefGroup(questionInGroup.value)
        })

        return {
            questionInGroup
        }
    }
}
</script>