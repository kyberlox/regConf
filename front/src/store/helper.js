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
                    text: 'Температура должна быть в диапазоне от 40 до -60°С'
                },
                {
                    id: 4,
                    inputName: 'pp',
                    text: 'Давление настройки должно быть больше противодавления статического и большие или равно динамическому противодавлению'
                },
                {
                    id: 5,
                    text: 'Укажите минимальную температуру среды'
                },
                {
                    id: 6,
                    text: 'Укажите максимальную температуру среды'
                },
                {
                    id: 7,
                    text: 'Пружинный'
                },
                {
                    id: 8,
                    text: 'Пилотный'
                },
                {
                    id: 9,
                    text: 'Давление не может быть больше 250 атм.'
                },
                {
                    id: 10,
                    text: 'Укажите наличие переменного противодавления или его отсутствие'
                },
                {
                    id: 11,
                    text: 'Противодавление не может быть больше давления начала открытия'
                },
                {
                    id: 12,
                    text: 'Укажите динамическое противодавление'
                },
                {
                    id: 13,
                    text: 'Динамическое противодавление не может быть меньше статического'
                },
                {
                    id: 14,
                    text: 'Укажите наличие переменного противодавления или его отсутствие'
                },
                {
                    id: 15,
                    text: 'Укажите аварийный расход или переходите к указанию типа присоединения клапана, указав расход равным 0'
                },
                {
                    id: 16,
                    text: 'Укажите единицы измерения расхода'
                },
                {
                    id: 17,
                    text: 'Укажите тип присоединения клапана'
                },
                {
                    id: 18,
                    text: 'Укажите наличие узла подрыва'
                },
                {
                    id: 19,
                    text: 'Укажите наличие поворотных заглушек'
                },
                {
                    id: 20,
                    text: 'Укажите наличие абразивных частиц'
                },
                {
                    id: 21,
                    text: 'Заполните поля DN входа, PN входа, вид сброса среды, герметичность затвора и все готово!'
                },
                {
                    id: 22,
                    text: 'Температура не может быть больше 470 градусов'
                },
                {
                    id: 23,
                    text: 'Укажите единицы измерения'
                },
                {
                    id: 24,
                    text: 'Укажите единицы измерения расхода'
                },
                {
                    id: 25,
                    text: 'Рекомендуется корпус из проката. Обратите внимание, что применить стандартную фланцевую отливку корпуса нельзя, поэтому укажите в графе МАТЕРИАЛ КОРПУСА прокатную сталь'
                },
                {
                    id: 26,
                    text: 'Укажите количество одновременно работающих клапанов'
                },
                {
                    id: 27,
                    text: 'Укажите наличие разрывной мембраны на входе'
                },
                {
                    id: 28,
                    text: 'Введите плотность из ОЛ или заполните поле Молярная масса'
                },
                {
                    id: 29,
                    text: 'Введите плотность при нормальных условиях из ОЛ или заполните поле Молярная масса'
                },
                {
                    id: 30,
                    text: 'Необходимо заполнить поля Показатель адиабаты и Динамическая вязкость'
                },
                {
                    id: 31,
                    text: 'Укажите тип присоединения, сравните параметры среды с с ОЛ. Для расчета плотности требуется молярная масса, температура и давление, для расхода давление, показатель адиабаты и динамическая вязкость, плотность'
                },
                {
                    id: 32,
                    text: 'Нужен пилотный. Не хватает расхода!! Нужно взять пилотный клапан вместо пружинного или увеличить количество клапанов'
                },
                {
                    id: 33,
                    text: 'Не делаем. Не хватает расхода!! Увеличьте количество клапанов'
                },
                {
                    id: 34,
                    text: 'Требуется увеличить DN. Первичный расчет не сходится с уточняющим, увеличьте DN до следующего значения в ряду'
                },
                {
                    id: 35,
                    text: 'Не делаем из-за низкого давления настройки'
                }
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
                const target = newErrors[newErrors.length - 1].inputGroup ? newErrors[newErrors.length - 1].inputGroup : newErrors[newErrors.length - 1].inputName;
                if (!target.inputGroup) {
                    nodeRefs.value[target]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    nodeRefs.value[target]?.classList.add('card--error-highlight');
                }

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