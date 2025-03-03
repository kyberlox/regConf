<template>
    <transition name="toast">
        <div v-if="visible"
             class="toast"
             @click="closeToast">
            {{ message }}
            <svg viewBox="0 0 24 24"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.75 9.49794V14.4961H11.25V9.49794H12.75Z"
                      fill="currentColor" />
                <path d="M13 17.495H11V15.4957H13V17.495Z"
                      fill="currentColor" />
                <path fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.567 3.99695L3 18.8299V19.9969L21 19.9968V18.8298L12.433 3.99695H11.567ZM19.076 18.4974L4.92404 18.4975L12 6.24613L19.076 18.4974Z"
                      fill="currentColor" />
            </svg>
        </div>
    </transition>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStores } from '@/composables/useStores';
export default {
    setup() {
        const stores = useStores();

        onMounted(() => {
            setTimeout(() => {
                stores.toastStore.initToast('', false)
            }, 5000)
        });

        return {
            message: computed(() => stores.toastStore.getToastMessage),
            visible: computed(() => stores.toastStore.getToastVisible),
            closeToast: () => stores.toastStore.initToast('', false),
        }
    }
}
</script>