<template>
    <div class="helper__wrapper">
        <div class="helper">
            <div class="helper__nav-group">
                <div v-for="item in navTabs"
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
                         :class="[
                            {
                                'helper__message--attention': message.type === 'emptyValueError' ||
                                    message.class === 'attention'
                            },
                            {
                                'helper__message--greetings': message.class === 'greetings'
                            },
                            {
                                'helper__message--neutral': message.class === 'neutral'
                            }]"
                         :key="'message' + index"
                         @click="goToQuestion(message.inputName)"
                         v-html=addSvgToHtml(message.text)>
                    </div>
                </TransitionGroup>
            </div>

            <div v-if="navActive == 'tkp'"
                 class="helper__content helper__content--tkp">
                <div class="">Последние активности</div>
                <TransitionGroup name="slide-down">
                    <div class="helper__message helper__message--tkp"
                         v-for="(doc, index) in latestTkps"
                         :key="'message' + index">
                        <RouterLink :to="{ name: 'positionHistory', params: { id: doc.id } }">
                            {{ doc.name }}
                        </RouterLink>
                        <!-- <div class="helper__message helper__message--tkp-pos"
                             :class="{ hidden: doc.hidden }"
                             v-for="(item, index) in doc.inner"
                             :key="'message' + index"
                             @click.stop="console.log(item)">
                            {{ item }}
                        </div> -->
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
import { useUserStore } from "@/store/user";
import { useHistoryStore } from "@/store/history";
import { useHelperStore } from "@/store/helper";
import { computed, ref, watch } from "vue";
import Api from "@/utils/Api";
export default {
    components: {
        Cancel,
    },
    emits: ["closeCalcParams", "goToQuestion"],
    setup(props, { emit }) {
        const userStore = useUserStore();
        const historyStore = useHistoryStore();
        const autorizeStatus = computed(() => userStore.getAutorizeStatus);

        const navActive = ref('help');
        const helperStore = useHelperStore();
        const goToQuestion = (name) => {
            if (name) {
                emit('goToQuestion', name)
            }
        }

        const latestTkps = computed(() => historyStore.getLatestTkps);

        const download = (id, name) => {
            Api.get(API_URL + '/upload_tkp/' + id, true)
                .then((data) => {
                    Api.post(API_URL + '/generate/', data, true, false, name)
                })
        }

        const navTabs = ref([{ title: 'Помощь', nav: 'help' }, { title: 'ТКП', nav: 'tkp' }]);
        watch(autorizeStatus, (newValue) => {
            newValue ? navTabs.value = [{ title: 'Помощь', nav: 'help' }, { title: 'ТКП', nav: 'tkp' }] : navTabs.value = [{ title: 'Помощь', nav: 'help' }];
        }, { deep: true, immediate: true });

        return {
            closeCalcParams: () => emit("closeCalcParams"),
            goToQuestion,
            isLoading: false,
            messages: computed(() => helperStore.getMessages),
            latestTkps,
            navActive,
            navTabs,
            goToNav: (name) => navActive.value = name,
            download,
            addSvgToHtml: (html) => {
                return html + `<svg class="helper__message__icon" viewBox="0 0 24 24"
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
            </svg>`}
        }
    }
}
</script>