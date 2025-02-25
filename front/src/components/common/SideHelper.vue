<template>
    <div class="helper__wrapper">
        <div class="helper">
            <div class="helper__nav-group">
                <div v-for="item in [{ title: 'Помощь', nav: 'help' }, { title: 'ТКП', nav: 'tkp' }]"
                     :key="item.nav"
                     class="helper__nav__wrapper helper__nav__wrapper"
                     :class="{ 'helper__nav__wrapper--active': navActive == item.nav }">
                    <div class="helper__title helper__nav-title"
                         @click="goToNav(item.nav)">{{ item.title }}</div>
                </div>
            </div>
            <div v-if="navActive == 'help'"
                 class="helper__content helper__content--help">
                <TransitionGroup name="slide-down">
                    <div class="helper__message"
                         v-for="(message, index) in messages"
                         :key="'message' + index"
                         @click="goToQuestion(message.inputName)">
                        {{ message.text }}
                    </div>
                </TransitionGroup>
            </div>

            <div v-if="navActive == 'tkp'"
                 class="helper__content helper__content--tkp">
                <TransitionGroup name="slide-down">
                    <div class="helper__message helper__message--tkp"
                         v-for="(doc, index) in latestTkps"
                         :key="'message' + index"
                         @click.stop="changeTkpVisibility(index)">
                        {{ doc.name }}
                        <div class="helper__message helper__message--tkp-pos"
                             :class="{ hidden: doc.hidden }"
                             v-for="(item, index) in doc.inner"
                             :key="'message' + index"
                             @click.stop="console.log(item)">
                            {{ item }}
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <div class="helper__close-icon__wrapper">
            <Cancel @click="closeCalcParams"
                    class="helper__close-icon" />
        </div>
    </div>
</template>

<script>
import Cancel from "@/assets/icons/Cancel.vue";
import { useHelperStore } from "@/store/helper";
import { computed, ref } from "vue";
export default {
    components: {
        Cancel,
    },
    emits: ["closeCalcParams", "goToQuestion"],
    setup(props, { emit }) {
        const navActive = ref('help');
        const helperStore = useHelperStore();
        const goToQuestion = (name) => {
            if (name) {
                emit('goToQuestion', name)
            }
        }

        const changeTkpVisibility = (index) => {
            latestTkps.value[index].hidden = !latestTkps.value[index].hidden;
        }
        const latestTkps = ref([
            { id: 1, name: 'ТКП-2023-001', inner: ['Позиция 1', 'Позиция 2', 'Позиция 3'], hidden: true },
            { id: 2, name: 'ТКП-2023-002', inner: ['Позиция 1', 'Позиция 2', 'Позиция 3'], hidden: true },
            { id: 3, name: 'ТКП-2023-003', inner: ['Позиция 1', 'Позиция 2', 'Позиция 3'], hidden: true },
        ]);
        return {
            closeCalcParams: () => emit("closeCalcParams"),
            goToQuestion,
            isLoading: false,
            messages: computed(() => helperStore.getMessages),
            latestTkps,
            navActive,
            goToNav: (name) => navActive.value = name,
            changeTkpVisibility
        }
    }
}
</script>
<style>
.helper__nav-title {
    margin: 0;
    padding: 0 0 5px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    cursor: pointer;
    transition: 0.2s all;
}

.helper__nav-title:hover {
    color: var(--emk-brand-color);
}


.helper__nav__wrapper {
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    margin-bottom: -1px;
}

.helper__nav__wrapper--active {
    border-bottom: 1px solid var(--emk-brand-color);
}

.helper__nav-group {
    margin-top: 23px;
    border-bottom: 1px solid #eee;
}

.helper__nav-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 13px;
    gap: 26px;
    margin-top: 23px;
}

.helper__message--tkp {
    cursor: pointer;
    border: 1px solid rgba(128, 128, 128, 0.227) !important;
    background: white !important;
    transition: 0.1s all ease-in-out;
}

.helper__message--tkp:hover {
    border: 1px solid var(--emk-brand-color) !important;
    background: white !important;
}

.helper__message--tkp-pos {
    border: 1px solid rgba(128, 128, 128, 0.227) !important;
    background: white !important;
    transition: 0.1s all ease-in-out;

}

.helper__message--tkp-pos:hover {
    /* border: 1px solid var(--emk-brand-color) !important; */
    background: rgb(255, 149, 51) !important;
    /* color: #1d0d0d; */
}

.helper__message--tkp-pos:first-child {
    margin-top: 10px;
}
</style>