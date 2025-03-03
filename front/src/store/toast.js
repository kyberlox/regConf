import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
    state: () => {
        return {
            message: "",
            visible: false
        }
    },

    actions: {
        initToast(text = "", status) {
            this.message = text;
            this.visible = status;
        }
    },

    getters: {
        getToastMessage: (state) => state.message,
        getToastVisible: (state) => state.visible,
    },
});