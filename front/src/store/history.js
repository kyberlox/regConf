import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('history', {
    state: () => {
        return {
            tkpHistory: [],
            tkpPosHistory: [],
        }
    },

    actions: {
        setTkpHistory(data) {
            if (data && data.length) {
                data.forEach((item) => {
                    item.name = decodeURIComponent(item.name);
                    item.date = item.date.split('-').reverse().join('-');
                    return
                });
                this.tkpHistory = data;
            } else {
                this.tkpHistory.length = 0;
            }
        },
        setTkpPosHistory(data) {
            this.tkpPosHistory = data;
        }
    },

    getters: {
        getTkpHistory: (state) => state.tkpHistory,
        getLatestTkps: (state) => {
            return state.tkpHistory.slice(-3);
        },
        getTkpPosHistory: (state) => state.tkpPosHistory,
    },
});