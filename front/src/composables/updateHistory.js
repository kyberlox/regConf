import Api from "@/utils/Api";
import { useHistoryStore } from "@/store/history";
export const updateHistory = () => {
    Api.post(API_URL + '/history', "", false, true)
        .then((data) => {
            useHistoryStore().setTkpHistory(data);
        })
}