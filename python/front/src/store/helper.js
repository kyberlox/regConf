import { defineStore } from 'pinia';

const DEFAULT_MESSAGE = {
    id: 0,
    text: 'Здесь будут содержаться подсказки и ошибки, возникающие при подборе',
};

export const useHelperStore = defineStore('helper', {
    state: () => {
        return {
            messages: [DEFAULT_MESSAGE],
            errors: [
                {
                    id: 1,
                    text: 'Заполните состав среды, обратите внимание, что компонент, занимающий большую долю смеси должен идти первым'
                },
                {
                    id: 2,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'envSumm',
                    text: 'Сумма объемных долей компонентов должна быть равна 100%'
                },
                {
                    id: 2.1,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'bothEnvSumm',
                    text: 'Сумма объемных долей по двум агрегатным состояниям должна быть равна 100%'
                },
                {
                    id: 3,
                    inputName: 'T',
                    text: 'Температура должна быть в диапазоне от -60°С до 600°С'
                },
                {
                    id: 4,
                    inputName: 'Pn',
                    text: 'Давление настройки должно быть больше 0.05Мпа и меньше 16Мпа'
                },
                {
                    id: 5,
                    inputName: 'Pp',
                    text: 'Значение должно быть меньше 16Мпа и состовлять не более 70% от давления настройки'
                },
                {
                    id: 6,
                    inputName: 'Pp_din',
                    text: 'Значение должно быть меньше 16Мпа и состовлять не более 70% от давления настройки'
                },
            ],
        };
    },

    actions: {
        setDefaultMessage() {
            this.messages = DEFAULT_MESSAGE;
        },
        setErrorMessage(name) {
            const existingMessage = this.messages.find(item => item.inputName === name);
            const newError = this.errors.find(item => item.inputName === name);

            if (!existingMessage && newError) {
                this.messages.push(newError);
            }
        },
        deleteErrorMessage(name) {
            this.messages = this.messages.filter((item) => item.inputName != name);
        },
        handleErrorHighlight(newErrors, nodeRefs) {
            Object.values(nodeRefs.value).forEach(element => {
                element?.classList?.contains('card--error-highlight') && element.classList.remove('card--error-highlight');
            });

            if (newErrors.length > 1) {
                newErrors.forEach(error => {
                    if (error.id !== 0 && nodeRefs.value[error.inputName]) {
                        nodeRefs.value[error.inputName].classList.add('card--error-highlight');
                    }
                });
            }
        }
    },

    getters: {
        getMessages: (state) => state.messages,
    },
});