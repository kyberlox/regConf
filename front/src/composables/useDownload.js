
import { ref, computed, watch } from 'vue'
import Api from '@/utils/Api'
import Validator from '@/utils/Validator'
export const useDownload = (stores) => {
    const jsonError = ref(false)
    const isAutorize = computed(() => stores.userStore.getAutorizeStatus)

    const checkForDownload = () => {
        jsonError.value = Validator.validDownloadJson(stores.questionsStore.questions, stores.helperStore)
    }
    // Проверка на соответствие обязательных параметров
    watch(() => jsonError, (oldVal, newVal) => {
        if (newVal && oldVal !== false) {
            stores.helperStore.deleteErrorMessage(null, 'emptyValueError');
        }
    }, { deep: true })

    const downloadHandle = (docName) => {
        console.log(docName);

        if (jsonError.value) {
            stores.helperStore.setErrorMessage(jsonError.value, 'emptyValueError')
            return
        }

        const dataToSend = computed(() => stores.envModuleStore.getAfterGetCompoundValue);

        if (isAutorize.value) {
            // МАСТЕР
            // Api.post(API_URL + '/set_data', [dataToSend.value], false, 'TESTNAME');
            // Api.get(API_URL + '/generate/TESTNAME');
            // Api.post(API_URL + '/makeOL', dataToSend.value, true);
        }

        // MAIN
        Api.post(API_URL + '/makeOL', dataToSend.value, true, false, "Опросный лист" + docName.replaceAll('.', '-'));
        Api.post(API_URL + '/generate', [dataToSend.value], true, false, "ТКП" + docName.replaceAll('.', '-'));
    }

    return {
        jsonError,
        checkForDownload,
        downloadHandle
    }
}
