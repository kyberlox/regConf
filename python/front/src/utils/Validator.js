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

    static async validDownloadJson(data) {
        console.log(data);

        const requiredFields = [
            "name",
            "environment",
            // "molecular_weight",
            // "density",
            // "material",
            // "viscosity",
            // "isobaric_capacity",
            // "molar_mass",
            // "isochoric_capacity",
            // "adiabatic_index",
            // "compressibility_factor",
            // "Pn",
            // "Pp",
            // "Pp_din",
            // "Gab",
            // "N",
            // "pre_Kc",
            // "T",
            // "climate",
            // "valve_type",
            // "need_bellows",
            // "open_close_type",
            // "T_min",
            // "T_max",
            // "Pno",
            // "Ppo",
            // "P1",
            // "P2",
            // "Kw",
            // "Gideal",
            // "pre_DN",
            // "DN_s",
            // "PN",
            // "DN",
            // "DN2",
            // "PN2",
            // "spring_material",
            // "spring_number",
            // "joining_type",
            // "mark",
            // "contact_type",
            // "inlet_flange",
            // "outlet_flange",
            // "color",
            // "packaging",
            // "tightness",
            // "docs",
            // "pipe_material",
            // "additionally",
            // "quantity",
            // "OL_num",
            // "rotary_plugs",
            // "thermal_cover",
            // "need_ZIP",
            // "acceptance",
            // "adapters",
            // "needKOF",
            // "abrasive_particles",
            // "reciprocal_connections"
        ]
        const hasAllFields = requiredFields.every(field =>
            Object.prototype.hasOwnProperty.call(data.value, field));
        if (!hasAllFields) {
            console.log('dsdsadsaa');

            return false;
        } else return true;
    }
}