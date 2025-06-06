import { updateHistory } from "@/composables/updateHistory";

export const routeHandle = (router, userStore, questionStore, pageStore) => {
    router.beforeEach((to, from, next) => {
        pageStore().setCurrentRoute(to.name);
        questionStore().resetQuestionGroup('all');
        if (to.name === 'homeWithToken') {
            userStore().setToken(to.params.token);
            router.push({ name: 'home' });
        } else if (to.name == 'history') {
            userStore().getAutorizeStatus ? next() : router.push({ name: 'home' });
            updateHistory();
        }
        else
            next()
    })
}