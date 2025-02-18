export const changeToMpa = (unit, x) => {
    switch (unit) {
        case 'Мпа':
            return x;
        case 'Кпа':
            return x = x / 1000;
        case 'Па':
            return x = x / 1000000;
        case 'бар':
            return x = x * 0.1;
        case 'кгс/см2':
            return x = x / 0.0980665;
    }
};