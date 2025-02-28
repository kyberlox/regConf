import { defineStore } from 'pinia';
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: Cookies.get('token') || '',
            ip: '',
            autorizationStatus: false,
        }
    },

    actions: {
        setToken(token) {
            this.token = token;
            Cookies.set('token', token, {
                expires: 7,
            });
        },

        setIp(ip) {
            this.ip = ip;
            Cookies.set('ip', ip, {
                expires: 7,
            });
        },
        setAutorizeStatus(status) {
            this.autorizationStatus = status;
        }
    },

    getters: {
        getAutorizeStatus: (state) => Boolean(state.autorizationStatus),
        getIp: (state) => state.ip,
        getToken: (state) => state.token
    },
});