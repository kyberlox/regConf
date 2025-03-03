import { defineStore } from 'pinia';
import { watch } from 'vue';
export const useHelperStore = defineStore('helper', {
    state: () => {
        return {
            messages: [],
            errors: [
                {
                    id: 1,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'envSumm',
                    text: 'Сумма объемных долей компонентов должна быть равна 100%',
                    type: 'calcError'
                },
                {
                    id: 1.1,
                    inputGroup: 'envAnswersGroup',
                    inputName: 'bothEnvSumm',
                    text: 'Сумма объемных долей по двум агрегатным состояниям должна быть равна 100%',
                    type: 'calcError'
                },
                {
                    id: 2,
                    inputName: 'T',
                    text: 'Температура должна быть в диапазоне от -60°С до 600°С',
                    type: 'calcError'
                },
                {
                    id: 3,
                    inputName: 'Pn',
                    text: 'Давление настройки должно быть меньше 16Мпа',
                    type: 'calcError'
                },
                {
                    id: 4,
                    inputName: 'Pp',
                    text: 'Значение должно быть меньше 16Мпа и составлять не более 70% от давления настройки',
                    type: 'calcError'
                },
                {
                    id: 5,
                    inputName: 'Pp_din',
                    text: 'Значение должно быть меньше 16Мпа и составлять не более 70% от давления настройки',
                    type: 'calcError'
                },
                {
                    id: 6,
                    inputName: 'N',
                    text: 'Значение не может быть равно 0',
                    type: 'calcError'
                },
                {
                    id: 7,
                    inputName: 'Gab',
                    text: 'Значение не может быть равно 0',
                    type: 'calcError'
                },
            ],
            emptyValueErrors: [
                {
                    id: 1,
                    type: 'emptyValueError',
                    inputName: 'environmentType',
                    text: 'Укажите агрегатное состояние несущей рабочей среды:',
                },
                {
                    id: 2,
                    inputName: 'environment',
                    type: 'emptyValueError',
                    text: 'Заполните мольную долю состава рабочей среды, в %',
                },
                {
                    id: 3,
                    inputName: 'climate',
                    type: 'emptyValueError',
                    text: 'Укажите климатическое исполнение',
                },
                {
                    id: 4,
                    inputName: 'valve_type',
                    type: 'emptyValueError',
                    text: 'Укажите тип предохранительного клапана',
                },
                {
                    id: 5,
                    inputName: 'Pn',
                    type: 'emptyValueError',
                    text: 'Заполните значение давления настройки',
                },
                {
                    id: 6,
                    inputName: 'Pp',
                    type: 'emptyValueError',
                    text: 'Заполните значение статического давления',
                },
                {
                    id: 7,
                    inputName: 'Pp_din',
                    type: 'emptyValueError',
                    text: 'Заполните значение динамического давления',
                },
                {
                    id: 8,
                    inputName: 'Gab',
                    type: 'emptyValueError',
                    text: 'Заполните значение максимального аварийного расхода',
                },
                {
                    id: 9,
                    inputName: 'N',
                    type: 'emptyValueError',
                    text: 'Укажите количество клапанов',
                },
                {
                    id: 10,
                    inputName: 'T',
                    type: 'emptyValueError',
                    text: 'Укажите значение температуры',
                },
                {
                    id: 11,
                    inputName: 'joining_type',
                    type: 'emptyValueError',
                    text: 'Укажите значение типа присоединения',
                },
                {
                    id: 12,
                    inputName: 'contact_type',
                    type: 'emptyValueError',
                    text: 'Заполните тип контакта',
                },
                {
                    id: 13,
                    inputName: 'inlet_flange',
                    type: 'emptyValueError',
                    text: 'Заполните фланец на входе',
                },
                {
                    id: 14,
                    inputName: 'outlet_flange',
                    type: 'emptyValueError',
                    text: 'Заполните фланец на выходе',
                },
                {
                    id: 15,
                    inputName: 'color',
                    type: 'emptyValueError',
                    text: 'Укажите способ покраски',
                },
                {
                    id: 16,
                    inputName: 'packaging',
                    type: 'emptyValueError',
                    text: 'Выберите упаковку',
                },
                {
                    id: 17,
                    inputName: 'tightness',
                    type: 'emptyValueError',
                    text: 'Укажите герметичность затвора ',
                },
                {
                    id: 18,
                    inputName: 'pipe_material',
                    type: 'emptyValueError',
                    text: 'Заполните материал и размер трубопровода',
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
            }],
        };
    },

    actions: {
        setErrorMessage(name, type = 'calcError') {
            if (type == 'calcError') {
                const existingMessage = this.messages.find(item => item.inputName == name && item.type == 'calcError');
                const newError = this.errors.find(item => item.inputName == name && item.type == 'calcError');

                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
            else if (type == 'emptyValueError') {
                this.messages = this.messages.filter((item) => item.type !== 'emptyValueError');

                const existingMessage = this.messages.find(item => item.inputName === name && item.type == 'emptyValueError');
                const newError = this.emptyValueErrors.find(item => item.inputName === name && item.type == 'emptyValueError');

                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
            else if (type == 'serverError') {
                this.deleteErrorMessage('', 'serverError');
                this.messages.push({
                    inputName: '',
                    type: 'serverError',
                    text: `${name}`,
                },)
            }
            else if (type == 'autorizeError') {
                this.deleteErrorMessage('', 'autorizeError');
                const newError = this.autorizeErrors.find(item => item.inputName === name && item.type == 'autorizeError');
                const existingMessage = this.messages.find(item => item.inputName === name && item.type == 'autorizeError');
                if (!existingMessage && newError) {
                    this.messages.push(newError);
                }
            }
        },
        deleteErrorMessage(name, group = false, nameFromGroup = false) {
            if (nameFromGroup) {
                this.messages.find(e => e.inputName === name);
                this.messages = this.messages.filter((item) => (item.inputName !== name && item.type !== group));
            }
            else if (!group) {
                this.messages = this.messages.filter((item) => item.inputName !== name);
            }
            else {
                this.messages = this.messages.filter(item => item.type !== group);
            }
        },
        handleErrorHighlight(newErrors, nodeRefs) {
            Object.values(nodeRefs.value).forEach(element => {
                element?.classList?.contains('card--error-highlight') && element.classList.remove('card--error-highlight');
                element?.classList?.contains('card--attention-highlight') && element.classList.remove('card--attention-highlight');
            });

            if (newErrors.length) {
                newErrors.forEach(error => {
                    if (nodeRefs.value[error.inputName] && error.type == 'emptyValueError') {
                        nodeRefs.value[error.inputName].classList.add('card--attention-highlight');
                    }
                    else
                        if (nodeRefs.value[error.inputName]) {
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
        isValid: (state) => state.messages.filter(item => item.type == 'calcError').length == 0,
    },
});