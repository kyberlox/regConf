import { defineStore } from 'pinia';
import { watch } from 'vue';
import { calcErrors } from '@/assets/staticJsons/errors/calcErrors';
import { emptyValueErrors } from '@/assets/staticJsons/errors/emptyValueErrors';
import { autorizeErrors } from '@/assets/staticJsons/errors/autorizeErrors';
import { temporaryMessages } from '@/assets/staticJsons/errors/temporaryMessages';
import { findQuestion } from '@/utils/findQuestionInStore';

export const useHelperStore = defineStore('helper', {
    state: () => ({
        messages: [],
        errors: calcErrors,
        emptyValueErrors,
        autorizeErrors,
        temporaryMessages
    }),

    actions: {
        addMessage(message, type) {
            const messageExists = this.messages.find(item =>
                item.inputName === message.inputName &&
                item.type === type
            );

            if (!messageExists) {
                this.messages.push(message);
            }
        },

        handleTemporaryMessage(message) {
            if (message.inputName == 'quantityNoLight' && message.class == 'neutral') {
                message.text = 'Обращаем внимание, что для обеспечения пропускной способности на одной позиции использовалось клапанов: ' + findQuestion('quantity').value + 'шт.'
            }

            this.addMessage(message, 'temporaryMessage');
            setTimeout(() => {
                this.deleteErrorMessage(message.inputName, 'temporaryMessage');
            }, 8000);
        },

        setErrorMessage(name, type = 'calcError') {
            const messageHandlers = {
                calcError: () => {
                    const newError = this.errors.find(item =>
                        item.inputName === name &&
                        item.type === 'calcError'
                    );
                    if (newError) this.addMessage(newError, type);
                },

                emptyValueError: () => {
                    this.deleteErrorMessage('', 'emptyValueError');
                    const newError = this.emptyValueErrors.find(item =>
                        item.inputName === name
                    );
                    if (newError) this.addMessage(newError, type);
                },

                serverError: () => {
                    this.deleteErrorMessage('', 'serverError');
                    this.messages.push({
                        inputName: '',
                        type: 'serverError',
                        text: name,
                    });
                },

                autorizeError: () => {
                    this.deleteErrorMessage('', 'autorizeError');
                    const newError = this.autorizeErrors.find(item =>
                        item.inputName === name
                    );
                    if (newError) this.messages.unshift(newError);
                },

                temporaryMessage: () => {
                    const newError = this.temporaryMessages.find(item =>
                        item.inputName === name
                    );
                    if (newError) this.handleTemporaryMessage(newError);
                }
            };

            const handler = messageHandlers[type];
            if (handler) handler();
        },

        deleteErrorMessage(name, group = false, nameFromGroup = false) {
            if (nameFromGroup) {
                this.messages = this.messages.filter(item =>
                    item.inputName !== name ||
                    item.type !== group
                );
                return;
            }

            this.messages = this.messages.filter(item =>
                group ? item.type !== group : item.inputName !== name
            );
        },

        handleErrorHighlight(errors, nodeRefs) {
            Object.values(nodeRefs.value).forEach(element => {
                element?.classList?.remove('card--error-highlight', 'card--attention-highlight');
            });

            errors.forEach(error => {
                const element = nodeRefs.value[error.inputName];
                if (!element) return;

                const highlightClass = error.type === 'emptyValueError'
                    ? 'card--attention-highlight'
                    : 'card--error-highlight';

                element.classList.add(highlightClass);
            });
        },

        watchErrors(nodeRefs) {
            watch(
                () => [...this.messages],
                (newErrors) => this.handleErrorHighlight(newErrors, nodeRefs),
                { deep: true }
            );
        }
    },

    getters: {
        getMessages: state => state.messages,
        isValid: state => !state.messages.some(item => item.type === 'calcError')
    }
});
