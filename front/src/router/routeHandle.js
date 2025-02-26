export const routeHandle = (router, userStore, questionStore, pageStore) => {
    router.beforeEach((to, from, next) => {
        pageStore().setCurrentRoute(to.name);
        questionStore().resetQuestionGroup('all');
        if (to.name === 'homeWithToken') {
            userStore().setToken(to.params.token);
        }
        next()
    })
}