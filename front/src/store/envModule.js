import { defineStore } from 'pinia';

export const useEnvModuleStore = defineStore('envModule', {
    state: () => ({
        envValues: [],
        afterGetCompoundValue: [],
        gasEnvNames: [],
        liquidEnvNames: [],
    }),

    actions: {
        setEnvValues(values) {
            this.envValues = values;
            this.categorizeEnvironments(values);
        },

        categorizeEnvironments(values) {
            values.forEach(item => {
                switch (item.environment) {
                    case 'Жидкость':
                        this.liquidEnvNames.push(item.name);
                        break;
                    case 'Газ':
                        this.gasEnvNames.push(item.name);
                        break;
                }
            });
        },

        setAfterGetCompoundValue(value) {
            this.afterGetCompoundValue = value;
        },

        pushToAfterGetCompoundValue(value) {
            Object.assign(this.afterGetCompoundValue, value);
        }
    },

    getters: {
        getLiquidEnv: state => state.envValues.filter(item => item.environment === 'Жидкость'),
        getGasEnv: state => state.envValues.filter(item => item.environment === 'Газ'),
        getAfterGetCompoundValue: state => state.afterGetCompoundValue
    },
});
