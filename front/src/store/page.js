import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
    state: () => {
        return {
            debugMode: false,
            currentRoute: '',
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
        },
        setCurrentRoute(route) {
            this.currentRoute = route;
        },
        setDebugMode(mode) {
            this.debugMode = mode;
        }
    },

    getters: {
        getNodeRefs: (state) => state.nodeRefs,
    },
});