import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            currentPage: '',
        }
    },

    actions: {

    },

    getters: {
        getNodeRefs: (state) => state.nodeRefs,
    },
});