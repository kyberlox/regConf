
import { ref, computed, watch } from 'vue'
import Api from '@/utils/Api'
import Validator from '@/utils/Validator'
export const useDownload = (stores) => {
    const jsonError = ref(false)

    const checkForDownload = () => {
        jsonError.value = Validator.validDownloadJson(stores.questionsStore.questions, stores.helperStore)
    }
    // Проверка на соответствие обязательных параметров
    watch(() => jsonError, (oldVal, newVal) => {
        if (newVal && oldVal !== false) {
            stores.helperStore.deleteErrorMessage(null, 'emptyValueError');
        }
    }, { deep: true })

<<<<<<< HEAD
    const downloadHandle = (docName, type) => {
=======
    const downloadHandle = () => {
>>>>>>> f86393a2c63a1ce2b5f0e8a8dd0e395443f7fb33
        if (jsonError.value) {
            stores.helperStore.setErrorMessage(jsonError.value, 'emptyValueError')
            return
        }

        const olData = computed(() => stores.envModuleStore.getAfterGetCompoundValue);
        const tkpData = computed(() => stores.envModuleStore.getTkpData);

<<<<<<< HEAD
        if (type == 'singleDownload') {
            Api.post(API_URL + '/generate', tkpData.value, true, true, "ТКП " + docName.replaceAll('.', '-'))
                .then(() => {
                    Api.post(API_URL + '/makeOL', olData.value, true, true, "Опросный лист " + docName.replaceAll('.', '-'))
                        .then(() => {
                            stores.envModuleStore.nulifyTkpData();
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
                                });
                        })
                })
=======
        if (isAutorize.value) {
            Api.post(API_URL + '/set_data', [dataToSend.value], false, 'TESTNAME');
            Api.get(API_URL + '/generate/TESTNAME');
            Api.post(API_URL + '/makeOL', dataToSend.value, true);
>>>>>>> f86393a2c63a1ce2b5f0e8a8dd0e395443f7fb33
        }
    }

    return {
        jsonError,
        checkForDownload,
        downloadHandle,
    }
}
