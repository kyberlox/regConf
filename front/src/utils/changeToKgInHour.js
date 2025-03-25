export const changeToKgInHour = (unit, x, density) => {
    switch (unit) {
        case 'Кг/час':
            return x;
        case 'м3/час':
            return x;
        case 'Нм3/час':
            return x * density;
        case 'T/час':
            return x * 1000;
    }
};