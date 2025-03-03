export default class Validator {

    static async validTemperature(value, store) {
        if (value < -60 || value > 600) {
            store.setErrorMessage('T', 'calcError');
        }
        else {
            store.deleteErrorMessage('T', 'calcError', true);
        }
    }

    static async validPressure(pressure, type, ratio = null, store) {
        if ((pressure.value > 16)
            || (ratio && pressure.value / ratio > 0.7)) {
            store.setErrorMessage(type, 'calcError');
        }
        else {
            store.deleteErrorMessage(type, 'calcError', true);
        };
    }

    static async validForNull(val, name, store) {
        if (val && val == 0 || Array.isArray(val) && val.length && val[0].value == 0) {
            store.setErrorMessage(name, 'calcError');
        } else {
            store.deleteErrorMessage(name, 'calcError', true);
        }
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