export const changeToKgInHour = (unit, x) => {
    switch (unit) {
        case 'Кг/час':
            return x;
        case 'м3/час':
            return x * 1000;
        case 'Нм3/час':
            return x * 1.225;
        case 'T/час':
            return x * 1000;
    }
};