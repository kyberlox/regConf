import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('history', {
    state: () => {
        return {
            tkpHistory: [
            ],
        }
    },

    actions: {
        setTkpHistory(tkpHistory) {
            if (tkpHistory && tkpHistory.length) {
                tkpHistory.forEach((item) => {
                    item.name = decodeURIComponent(item.name);
                    item.date = item.date.split('-').reverse().join('-');
                    return
                });
            }
            this.tkpHistory = tkpHistory;
        },
    },

    getters: {
        getTkpHistory: (state) => state.tkpHistory,
        getLatestTkps: (state) => {
            return state.tkpHistory.slice(-3);
        }
    },
});