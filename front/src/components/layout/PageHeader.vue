<template>
    <nav class="header__navbar navbar bg-body-tertiary">
        <div class="header-container container-fluid">
            <RouterLink :to="{ name: 'home' }">
                <img class="header__logo"
                     src="/imgs/logo.svg" />
            </RouterLink>
            <div class="navbar-brand">Конфигуратор Регулятор</div>
            <button class="navbar-toggler"
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
                        <li v-for="(item, index) in sideNavigation"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import sideNavigation from "@/assets/staticJsons/sideNavigation.json";

export default {
    setup() {
        const router = useRouter();
        const isSidebarOpen = ref(false);

        const toggleSidebar = () => {
            isSidebarOpen.value = !isSidebarOpen.value;
        };

        return {
            router,
            sideNavigation,
            isSidebarOpen,
            toggleSidebar
        }
    }
}
</script>