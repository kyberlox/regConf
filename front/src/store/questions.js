import { defineStore } from 'pinia';
import questionsBank from '@/assets/staticJsons/questionBank.json';
import { useEnvModuleStore } from './envModule';
import { useStores } from '@/composables/useStores';
export const useQuestionsStore = defineStore('questions', {
    state: () => ({
        questions: questionsBank,
        resetGroups: {
            'all': ['getTable', 'compound', 'pressure', 'mark', 'tightness'],
            'getTable': ['compound', 'pressure', 'mark', 'tightness'],
            'compound': ['pressure', 'mark', 'tightness'],
            'pressure': ['mark', 'tightness'],
            'mark': ['tightness'],
        },
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
            if (type !== 'inputGroup' && type !== 'CheckBoxType') {
                this.resetQuestionGroup(targetQuestion.group);
            }
        },
        setConvertedValue(questionName, questionValue) {
            const targetQuestion = this.findQuestion(questionName);
            targetQuestion.convertedValue = questionValue;
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
        },
        resetQuestionGroup(group) {
            const targetGroups = this.resetGroups[group];
            if (!targetGroups) return;

            const resetHandlers = {
                oneLineType: (item) => {
                    item.value.forEach(e => {
                        e.value = null;
                        e.id = null;
                    });
                    item.inner.forEach(e => e.value = null);
                    return false;
                },
                inputGroup: (item) => {
                    let hasValue = false;
                    item.answers.forEach(e => {
                        if (e.value) hasValue = true;
                        e.value = null;
                    });
                    return hasValue;
                },
                CheckboxType: (item) => {
                    item.value = false;
                    return false;
                },
                default: (item) => {
                    item.value = null;
                    return false;
                }
            };

            this.questions.forEach(item => {
                if (!targetGroups.includes(item.group)) return;

                const handler = resetHandlers[item.type] || resetHandlers.default;
                const needMessage = handler(item);

                if (needMessage) {
                    const stores = useStores();
                    stores.helperStore.setErrorMessage('reset', 'temporaryMessage');
                }
            });
        }
    },
    getters: {
        getQuestions: (state) => state.questions,
        getMark: (state) => state.questions.find(item => item.inputName == 'mark').value,
    }
});
