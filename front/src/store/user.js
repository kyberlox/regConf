import { defineStore } from 'pinia';
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: Cookies.get('token') || '',
            ip: '',
        }
    },

    actions: {
        setToken(token) {
            this.token = token;
            Cookies.set('token', token, {
                expires: 7,
                // secure: false,
                // path: '/',
                // domain: window.location.hostname,
                // sameSite: 'lax'
            });
        },

        setIp(ip) {
            this.ip = ip;
            Cookies.set('ip', ip, {
                expires: 7,
                // secure: false,
                // path: '/',
                // domain: window.location.hostname,
                // sameSite: 'lax'
            });
        },
    },

    getters: {
        getAutorizeStatus: (state) => Boolean(state.token),
        getIp: (state) => state.ip,
        getToken: (state) => state.token
    },
});