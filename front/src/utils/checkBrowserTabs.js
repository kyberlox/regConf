import { ref, onMounted, onBeforeUnmount } from 'vue'

export default function useTabTracker() {
    const openTabsCount = ref(0)
    const tabKey = 'tab-' + Date.now() + '-' + Math.random()

    const updateOpenTabs = () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('tab-'))
        openTabsCount.value = keys.length
    }

    const handleStorage = (event) => {
        if (event.key && event.key.startsWith('tab-')) {
            updateOpenTabs()
        }
    }

    onMounted(() => {
        localStorage.setItem(tabKey, 'open')
        updateOpenTabs()
        window.addEventListener('storage', handleStorage)
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem(tabKey)
        })
    })

    onBeforeUnmount(() => {
        localStorage.removeItem(tabKey)
        window.removeEventListener('storage', handleStorage)
    })

    return {
        openTabsCount
    }
}