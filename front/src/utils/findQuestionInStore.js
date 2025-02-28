import { useQuestionsStore } from "@/store/questions"
import { computed } from "vue"
export const findQuestion = (name, subName = null) => {
    const questions = computed(() => useQuestionsStore().getQuestions)
    const question = questions.value.find(q => q.inputName === name)
    if (subName) {
        return question.answers.find(a => a.inputName === subName)
    }
    return question
}