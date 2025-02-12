import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
    state: () => {
        return {
            currentPage: '',
            nodeRefs: {},
        }
    },

    actions: {
        pushToRefGroup(refs) {
            const filteredRefs = Object.fromEntries(
                Object.entries(refs).filter(([key]) => key !== 'envAnswersGroup')
            );

            if (Object.keys(filteredRefs).length > 0) {
                Object.assign(this.nodeRefs, filteredRefs);
            }
        },
        goToQuestion(name) {
            this.nodeRefs[name]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    },

    getters: {
        getNodeRefs: (state) => state.nodeRefs,
    },
});