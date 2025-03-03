import { useQuestionsStore } from "@/store/questions"
import { useHelperStore } from "@/store/helper"
import { usePageStore } from "@/store/page"
import { useEnvModuleStore } from "@/store/envModule"
import { useUserStore } from "@/store/user"
import { useHistoryStore } from "@/store/history"
import { useToastStore } from "@/store/toast"

export const useStores = () => {
    return {
        questionsStore: useQuestionsStore(),
        helperStore: useHelperStore(),
        pageStore: usePageStore(),
        envModuleStore: useEnvModuleStore(),
        userStore: useUserStore(),
        historyStore: useHistoryStore(),
        toastStore: useToastStore(),
    }
}