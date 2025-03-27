import { ref, computed } from 'vue'
import Api from '@/utils/Api'
import Validator from '@/utils/Validator'
import { updateHistory } from './updateHistory'

export const useDownload = (stores) => {
    const jsonError = ref(false)
    const olData = computed(() => stores.envModuleStore.getAfterGetCompoundValue)
    const tkpData = computed(() => stores.envModuleStore.getTkpData)

    const checkForDownload = () => {
        jsonError.value = Validator.validDownloadJson();
    }

    const handlePostSuccess = async (docName) => {
        await Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName)
        stores.envModuleStore.nulifyTkpData()
        stores.helperStore.setErrorMessage('successDownload', 'temporaryMessage')
        updateHistory()
    }

    const downloadStrategies = {
        singleDownload: async (docName) => {
            stores.envModuleStore.pushToTkp();
            await Api.post(API_URL + '/generate', tkpData.value, true, true, "ТКП " + docName)
            await Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName)
            await stores.envModuleStore.nulifyTkpData()
            updateHistory()
        },

        add: async (docName) => {
            await Api.post(API_URL + '/set_data', tkpData.value, false, true, docName)
            await Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName)
            stores.helperStore.setErrorMessage('successAdd', 'temporaryMessage')
        },

        download: async (docName) => {
            await Api.post(API_URL + '/set_data', tkpData.value, false, true, docName)
            await Api.post(API_URL + '/generate', '', true, true, "ТКП " + docName)
            await handlePostSuccess(docName)
        }
    }

    const downloadHandle = async (docName, type) => {
        if (jsonError.value) {
            stores.helperStore.setErrorMessage(jsonError.value, 'emptyValueError')
            return
        }

        const formattedName = docName.replaceAll('.', '-')
        const downloadStrategy = downloadStrategies[type]

        if (downloadStrategy) {
            await downloadStrategy(formattedName)
        }
    }

    return {
        jsonError,
        checkForDownload,
        downloadHandle,
    }
}
