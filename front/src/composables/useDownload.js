
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
        if (jsonError.value) {
            stores.helperStore.setErrorMessage(jsonError.value, 'emptyValueError')
            return
        }

        const olData = computed(() => stores.envModuleStore.getAfterGetCompoundValue);
        const tkpData = computed(() => stores.envModuleStore.getTkpData);

        if (isAutorize.value) {
            Api.post(API_URL + '/set_data', tkpData.value, false, true, docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/generate', '', true, true, "ТКП " + docName.replaceAll('.', '-'))
                        .then(() => {
                            stores.envModuleStore.nulifyTkpData();
                        });
                });
            Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'));
        }
        else {
            Api.post(API_URL + '/generate', tkpData.value, true, true, "ТКП " + docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'))
                        .then(() => {
                            stores.envModuleStore.nulifyTkpData();
                        });;
                })
        }
    }

    return {
        jsonError,
        checkForDownload,
        downloadHandle,
    }
}
