import { defineStore } from 'pinia';
import questionsBank from '@/assets/staticJsons/questionBank.json';
import { useEnvModuleStore } from './envModule';

export const useQuestionsStore = defineStore('questions', {
    state: () => ({
        questions: questionsBank,
    }),

    actions: {
        findQuestion(questionName) {
            return this.questions.find((item) => item.inputName === questionName);
        },

        setQuestionValue(questionName, questionValue, type = 'default', index, targetGroup = false) {
            const targetQuestion = this.findQuestion(questionName);

            if (type == 'oneLine') {
                const newValue = [...targetQuestion.value];
                newValue[index] = { ...questionValue };
                targetQuestion.value = newValue;
                return;
            }
            else if (type == 'inputGroup') {
                this.questions.find((e) => (e.inputName == targetGroup)).answers.find((e) => (e.inputName == questionName)).value = questionValue;
            }
            else {
                targetQuestion.value = questionValue;
            }
        },

        setAnswers(questionName, questionValue, deep = true) {
            if (deep) {
                const targetQuestion = this.findQuestion(questionName).inner;
                targetQuestion.forEach(item => {
                    item.forEach(e => {
                        if (e.answers) {
                            e.answers = questionValue
                        };
                    });
                });
            }
            else {
                const targetQuestion = this.findQuestion(questionName);
                targetQuestion.answers = questionValue;
            }
        },

        setQuestionDisabled(questionName, disabled) {
            const targetQuestion = this.findQuestion(questionName);
            targetQuestion.disabled = disabled;
        },

        cloneQuestion(questionId) {
            const target = this.questions.find(item => item.id === questionId);
            const lastIndex = target.inner.length;
            const newInner = JSON.parse(JSON.stringify(target.inner[lastIndex - 1]));

            newInner.forEach(item => {
                item.id = parseFloat((item.id + 0.2).toFixed(2));
            });

            target.inner[lastIndex] = newInner;
        },
        reloadEnvTypes(type) {
            const envStore = useEnvModuleStore();

            const liquidEndValues = envStore.getLiquidEnv;
            const envGasValues = envStore.getGasEnv;
            if (type == 'gas') {
                this.setAnswers('environment', envGasValues);
                this.setAnswers('secondEnv', liquidEndValues);
            }
            else {
                this.setAnswers('environment', liquidEndValues);
                this.setAnswers('secondEnv', envGasValues);
            }
        },
        removeLine(name, index) {
            const target = this.findQuestion(name);
            target.value.splice(index, 1);
            target.inner.splice(index, 1);
        }
    }
});
