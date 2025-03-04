export const calcErrors = [
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
        text: 'Давление настройки должно быть меньше 16Мпа и больше 0',
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
]