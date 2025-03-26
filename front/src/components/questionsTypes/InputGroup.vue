<template>
    <div class="card__results-container">
        <div class="card__results__result-block"
             v-for="answer in question.answers"
             :key="answer.id"
             :class="{ hidden: answer.hidden }"
             :ref="(el) => (questionInGroup[answer.inputName] = el)">
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
            pageStore.pushToRefGroup(questionInGroup.value);
        });

        const specialize = (answer) => {
            if (answer.inputName == "compress_factor") {
                return 1;
            }
            else if (!answer.value) {
                return
            }
            // else if (answer.inputName == "pre_DN") {
            //     return answer.value.toFixed(1);
            // }
            else if (typeof answer.value == 'number' && String(answer.value).includes('.')) {
                const valueToArray = String(answer.value).replace(".", "").split("");

                let formattedAnswer;
                valueToArray.find((e, i) => {
                    if (e !== "0") {
                        return (formattedAnswer = answer.value.toFixed(Number(i + 3)).slice(0, -1));
                    }
                });
                return formattedAnswer;
            }
            // else if (String(answer.value).includes('.')) {
            //     return answer.value.toFixed(2);
            // }
            else
                return answer.value;
        };

        return {
            questionInGroup,
            specialize,
        };
    },
};
</script>
