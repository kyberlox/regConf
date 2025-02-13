export default class Validator {

    static async validTemperature(value, store) {
        if (value < -60 || value > 600) {
            store.setErrorMessage('T');
        } else {
            store.deleteErrorMessage('T');
        }
    }

    static async validPressure(pressure, type, ratio = null, store, convertor) {
        if (pressure.value && pressure.value < convertor(pressure.unit, 0.05)
            || pressure.value > convertor(pressure.unit, 16)
            || (ratio && pressure.value / ratio > 0.7)) {
            store.setErrorMessage(type);
        } else {
            store.deleteErrorMessage(type);
        };
    }
}