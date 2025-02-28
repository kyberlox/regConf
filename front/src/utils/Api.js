import { computed } from 'vue';
import { useUserStore } from '@/store/user';
export default class Api {
    static async get(url) {
        const response = await fetch(url);
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
            const downloadUrl = window.URL.createObjectURL(
                new Blob([blob], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
            );

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            return await response.json();
        }
    }
}