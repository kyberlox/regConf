import { defineStore } from 'pinia';

export const useAnswersStore = defineStore('answers', {
    state: () => {
        return {
            answers: [],
        };
    },

    actions: {
        addNewAnswer(answer) {
            this.answers.push(answer);
        }
    },

    getters: {
    },
});