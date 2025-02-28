import { defineStore } from 'pinia';
import { watch } from 'vue';

const DEFAULT_MESSAGE = {
    id: 0,
    text: 'Здесь будут содержаться подсказки и ошибки, возникающие при подборе. Расчет происходит по модели идеального сопла для идеального газа',
};

export const useHelperStore = defineStore('helper', {
    state: () => {
        return {
            messages: [DEFAULT_MESSAGE],
            errors: [
                {
                    id: 1,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'envSumm',
                    text: 'Сумма объемных долей компонентов должна быть равна 100%'
                },
                {
                    id: 1.1,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'bothEnvSumm',
                    text: 'Сумма объемных долей по двум агрегатным состояниям должна быть равна 100%'
                },
                {
                    id: 2,
                    inputName: 'T',
                    text: 'Температура должна быть в диапазоне от -60°С до 600°С'
                },
                {
                    id: 3,
                    inputName: 'Pn',
                    text: 'Давление настройки должно быть меньше 16Мпа'
                },
                {
                    id: 4,
                    inputName: 'Pp',
                    text: 'Значение должно быть меньше 16Мпа и составлять не более 70% от давления настройки'
                },
                {
                    id: 5,
                    inputName: 'Pp_din',
                    text: 'Значение должно быть меньше 16Мпа и составлять не более 70% от давления настройки'
                },
                {
                    id: 6,
                    inputName: 'N',
                    text: 'Значение не может быть равно 0'
                },
                {
                    id: 7,
                    inputName: 'Gab',
                    text: 'Значение не может быть равно 0'
                },
            ],
            emptyValueErrors: [
                {
                    id: 1,
                    type: 'emptyValueError',
                    inputName: 'environmentType',
                    text: 'Пропущено значение агрегатного состояния',
                },
                {
                    id: 2,
                    inputName: 'climate',
                    type: 'emptyValueError',
                    text: 'Пропущено значение климатического исполнения',
                },
                {
                    id: 3,
                    inputName: 'valve_type',
                    type: 'emptyValueError',
                    text: 'Пропущено значение типа клапана',
                },
                {
                    id: 4,
                    inputName: 'Pn',
                    type: 'emptyValueError',
                    text: 'Пропущено значение давления настройки',
                },
                {
                    id: 5,
                    inputName: 'Pp',
                    type: 'emptyValueError',
                    text: 'Пропущено значение статического давления',
                },
                {
                    id: 6,
                    inputName: 'Pp_din',
                    type: 'emptyValueError',
                    text: 'Пропущено значение динамического давления',
                },
                {
                    id: 7,
                    inputName: 'Gab',
                    type: 'emptyValueError',
                    text: 'Пропущено значение максимального аварийного расхода',
                },
                {
                    id: 8,
                    inputName: 'N',
                    type: 'emptyValueError',
                    text: 'Пропущено значение количества клапанов',
                },
                {
                    id: 9,
                    inputName: 'T',
                    type: 'emptyValueError',
                    text: 'Пропущено значение температуры',
                },
                {
                    id: 10,
                    inputName: 'joining_type',
                    type: 'emptyValueError',
                    text: 'Пропущено значение типа присоединения',
                },
                {
                    id: 11,
                    inputName: 'contact_type',
                    type: 'emptyValueError',
                    text: 'Пропущено значение типа контакта',
                },
                {
                    id: 12,
                    inputName: 'inlet_flange',
                    type: 'emptyValueError',
                    text: 'Пропущено значение фланца на входе',
                },
                {
                    id: 13,
                    inputName: 'outlet_flange',
                    type: 'emptyValueError',
                    text: 'Пропущено значение фланца на выходе',
                },
                {
                    id: 14,
                    inputName: 'color',
                    type: 'emptyValueError',
                    text: 'Пропущена покраска',
                },
                {
                    id: 15,
                    inputName: 'packaging',
                    type: 'emptyValueError',
                    text: 'Пропущена упаковка',
                },
                {
                    id: 16,
                    inputName: 'tightness',
                    type: 'emptyValueError',
                    text: 'Пропущена герметичность затвора ',
                },
                {
                    id: 17,
                    inputName: 'docs',
                    type: 'emptyValueError',
                    text: 'Укажите сопроводительную документацию',
                },
                {
                    id: 18,
                    inputName: 'pipe_material',
                    type: 'emptyValueError',
                    text: 'Пропущен материал и размер трубы',
                },
                {
                    id: 19,
                    inputName: 'quantity',
                    type: 'emptyValueError',
                    text: 'Укажите количество',
                },
            ],
            autorizeErrors: [{
                id: 1,
                type: 'autorizeError',
                inputName: 'tkpError',
                text: `<a class='helper__message-link' href='https://portal.emk.ru/intranet/tools/regconf.php'>Авторизуйтесь</a> для получения доступа к генерации ткп и истории запросов, без авторизации доступна только генерация опросного листа`
            }]
        };
    },

    actions: {
        setDefaultMessage() {
            this.messages = DEFAULT_MESSAGE;
        },
        setErrorMessage(name, type = 'calcError') {
            if (type == 'calcError') {
                const existingMessage = this.messages.find(item => item.inputName === name);
                const newError = this.errors.find(item => item.inputName === name);

                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
            else if (type == 'emptyValueError') {
                this.messages = this.messages.filter((item) => item.type !== 'emptyValueError');

                const existingMessage = this.messages.find(item => item.inputName === name);
                const newError = this.emptyValueErrors.find(item => item.inputName === name);

                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
            else if (type == 'serverError') {
                this.deleteErrorMessage('', 'serverError');
                this.messages.push({
                    inputName: '',
                    type: 'serverError',
                    text: `${name}}`,
                },)
            }
            else if (type == 'autorizeError') {
                this.deleteErrorMessage('', 'autorizeError');
                const newError = this.autorizeErrors.find(item => item.inputName === name);
                const existingMessage = this.messages.find(item => item.inputName === name);
                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
        },
        deleteErrorMessage(name, group = false) {
            if (!group) {
                this.messages = this.messages.filter((item) => item.inputName !== name);
            }
            else {
                this.messages = this.messages.filter(item => item.type !== group);
            }
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
        },
        watchErrors(nodeRefs) {
            watch(
                () => [...this.messages],
                (newErrors) => { this.handleErrorHighlight(newErrors, nodeRefs) },
                { deep: true }
            );
        }
    },

    getters: {
        getMessages: (state) => state.messages,
        isValid: (state) => state.messages.filter(item => item.type !== 'serverError' && item.type !== 'autorizeError').length == 1,
    },
});