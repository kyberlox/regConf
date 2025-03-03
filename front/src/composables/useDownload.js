
import { ref, computed, watch } from 'vue'
import Api from '@/utils/Api'
import Validator from '@/utils/Validator'
import { updateHistory } from './updateHistory'
export const useDownload = (stores) => {
    const jsonError = ref(false)

    const checkForDownload = () => {
        jsonError.value = Validator.validDownloadJson(stores.questionsStore.questions, stores.helperStore)
    }
    // Проверка на соответствие обязательных параметров
    // watch(() => jsonError, (oldVal, newVal) => {
    //     if (newVal && oldVal !== false) {
    //         // stores.helperStore.deleteErrorMessage(null, 'emptyValueError');
    //     }
    // }, { deep: true })

    const downloadHandle = (docName, type) => {
        if (jsonError.value) {
            stores.helperStore.setErrorMessage(jsonError.value, 'emptyValueError')
            return
        }

        const olData = computed(() => stores.envModuleStore.getAfterGetCompoundValue);
        const tkpData = computed(() => stores.envModuleStore.getTkpData);

        if (type == 'singleDownload') {
            Api.post(API_URL + '/generate', tkpData.value, true, true, "ТКП " + docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'))
                        .then(() => {
                            stores.envModuleStore.nulifyTkpData();
                            updateHistory();
                        });
                })
        }
        else if (type == 'add') {
            Api.post(API_URL + '/set_data', tkpData.value, false, true, docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'));
                });
        }
        else if (type == 'download') {
            Api.post(API_URL + '/set_data', tkpData.value, false, true, docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/generate', '', true, true, "ТКП " + docName.replaceAll('.', '-'))
                        .then(() => {
                            Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'))
                                .then(() => {
                                    stores.envModuleStore.nulifyTkpData();
                                    updateHistory();
                                });
                        })
                })
        }
    }

    return {
        jsonError,
        checkForDownload,
        downloadHandle,
    }
}
