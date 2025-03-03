export default class Validator {

    static async validTemperature(value, store) {
        if (value < -60 || value > 600) {
<<<<<<< HEAD
            store.setErrorMessage('T', 'calcError');
        }
        else {
            // store.deleteErrorMessage('T', 'calcError', true);
=======
            store.setErrorMessage('T');
        } else {
            store.deleteErrorMessage('T');
>>>>>>> parent of 9aa0991 (iss/добавил тост и подсветку пути)
        }
    }

    static async validPressure(pressure, type, ratio = null, store) {
        if ((pressure.value > 16)
            || (ratio && pressure.value / ratio > 0.7)) {
            store.setErrorMessage(type);
        } else {
            store.deleteErrorMessage(type);
        };
    }

    static validDownloadJson(data) {
        const requiredFields = [
            "environmentType",
            "environment",
            "climate",
            "valve_type",
            "Pn",
            "Pp",
            "Pp_din",
            "Gab",
            "N",
            "T",
            "joining_type",
            "contact_type",
            // "inlet_flange",
            // "outlet_flange",
            "color",
            "packaging",
            "tightness",
            "docs",
            "pipe_material",
            "quantity"
        ];

        const responseKeys = [];

        requiredFields.map((item) => {
            responseKeys.push(data.find(e => e.inputName == item))
        })

        const errorTarget = responseKeys.find(e => e.value == null || e.value == undefined || e.value.length == 0 || e.value == "");
        if (errorTarget) {
            return errorTarget.inputName;
        } else {
            return false;
        }
    }
}