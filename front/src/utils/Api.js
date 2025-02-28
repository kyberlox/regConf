import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { saveAs } from 'file-saver';

export default class Api {
    static async get(url, token = null) {
        const response = await fetch(url, {
            method: 'GET', headers: {
                ...token ? { 'token': useUserStore().getToken } : {}
            }
        });
        return await response.json();
    }

    static async post(url, body, download = false, needAutorize = false, name = "") {
        const authorization = computed(() => useUserStore().getToken ? useUserStore().getToken : `ip: ${useUserStore().getIp}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                ...(needAutorize ? { 'token': authorization.value } : {}),
                ...(download ? { 'name': encodeURIComponent(name) } : {})
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        if (response.headers.get('token')) {
            useUserStore().setToken(response.headers.get('token'));
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (download) {
            const blob = await response.blob();
            saveAs(blob, name + '.xlsx');
        } else {
            return await response.json();
        }
    }

    static async delete(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                token: useUserStore().getToken,
            }
        });
        return await response.json();
    }
}