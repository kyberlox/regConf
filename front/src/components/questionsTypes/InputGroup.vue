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
                <div class="card__results__result-value__number"
                     :class="{ 'card__results__result-value__number--min-font': answer.inputName == 'trials' }">
                    <span class="card__results__result-value__number-inner"
                          v-html="specialize(answer)"></span>
                </div>
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

        const specialize = (answer) => {
            if (answer.value > 0) { return answer.inputName == 'viscosity' ? answer.value : answer.value.toFixed(2) }
            else {
                return answer.inputName == 'compress_factor' ? 1 : answer.value;
            }

        }

        return {
            questionInGroup,
            specialize
        }
    }
}
</script>