<template>
    <nav class="header__navbar navbar bg-body-tertiary">
        <div class="header-container container-fluid">
            <RouterLink :to="{ name: 'home' }">
                <img class="header__logo"
                     src="/imgs/logo.svg" />
            </RouterLink>
            <div class="header__navbar-brand navbar-brand">Конфигуратор Регулятор</div>
            <button class="navbar-toggler header__navbar-toggler"
                    type="button"
                    @click="toggleSidebar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="sidebar"
                 :class="{ 'sidebar-active': isSidebarOpen }">
                <div class="sidebar-header">
                    <h5>Конфигуратор</h5>
                    <button class="btn-close"
                            @click="toggleSidebar" />
                </div>
                <div class="sidebar-content">
                    <ul class="sidebar-nav">
                        <li v-for="(item, index) in sideNav"
                            :key="index">
                            <RouterLink :to="{ name: item.route }"
                                        class="sidebar-link"
                                        @click="toggleSidebar">
                                {{ item.title }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="sidebar-overlay"
                 :class="{ 'overlay-active': isSidebarOpen }"
                 @click="toggleSidebar"></div>
        </div>
    </nav>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import sideNavigation from "@/assets/staticJsons/sideNavigation.json";
import { useUserStore } from "@/store/user";

export default {
    setup() {
        const router = useRouter();
        const isSidebarOpen = ref(false);
        const userStore = useUserStore();

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
        };

        const autorizeStatus = computed(() => userStore.getAutorizeStatus);

        return {
            router,
            sideNav: computed(() => autorizeStatus.value ? sideNavigation : sideNavigation.filter(item => item.route !== 'history')),
            isSidebarOpen,
            toggleSidebar
        }
    }
}
</script>