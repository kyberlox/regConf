<template>
    <div class="modal__wrapper">
        <Transition name="modal"
                    appear
                    enter-active-class="animate__animated animate__fadeIn"
                    leave-active-class="animate__animated animate__fadeOut">
            <div class="modal__container">
                <div class="modal__header">
                    <div class="modal__header-text"
                         v-if="type == 'support'">Поддержка сайта</div>
                    <div class="modal__header-close btn-close"
                         @click="closeModal"></div>
                </div>
                <div class="modal__body"
                     v-html="modalBodyInner">
                </div>
                <div class="modal__footer">
                    <div v-if="type == 'download'"
                         class="modal__button-group">
                        <div class="modal__input__wrapper"
                             :class="{ 'card--error-highlight': noDoc }">
                            <input class="modal__input"
                                   v-model="docName"
                                   placeholder="Введите название файла" />
                        </div>
                        <div class="modal__button"
                             @click="download">Скачать</div>
                        <div class="modal__button"
                             @click="addPos">Добавить</div>
                    </div>
                </div>
            </div>

        </Transition>
    </div>
</template>
<script>
import { ref } from 'vue';
export default {
    props: {
        type: {
            default: 'support',
        }
    },
    emits: ['closeModal, modalHandle'],
    setup(props, { emit }) {
        const supportBodyHtml = `<div class="support-info">
    <p class="support-email">
        По вопросам технической поддержки обращайтесь по электронной почте:
        <a href="mailto:it.dpm@emk.ru" class="email">it.dpm@emk.ru</a>
    </p>

    <div class="support-phone">
    <span class="support-phone-text">
        Либо по внутренним номерам:
    </span>
        <span class="support__contact-person">
            Газинский Игорь Владимирович - <strong>5182</strong>
        </span>
        <span class="support__contact-person">
            Тимофеев Александр Анатольевич - <strong>5185</strong>
        </span>
</div>
</div>`;

        const downloadBodyHtml = `<div class="support-info">
        <p>Вы можете сразу скачать текущий ТКП, либо добавить в него дополнительние позиции, для этого -
            <br/>после кнопки "добавить" заполните данные новой позиции, по заполнению всех позиций подряд, введите название файла и нажмите в этой форме "скачать"
                    </p>
                </div>`;

        const modalActive = ref(true);
        const modalBodyInner = ref(props.type == 'support' ? supportBodyHtml : downloadBodyHtml);

        const closeModal = () => {
            emit('closeModal');
        }

        const docName = ref('');
        const noDoc = ref(false);

        const download = () => {
            if (!docName.value) {
                noDoc.value = true;
            }
            else {
                emit('modalHandle', docName.value, 'download')
            }
        }
        return {
            closeModal,
            modalActive,
            modalBodyInner,
            download,
            addPos: () => emit('modalHandle', docName.value, 'add'),
            docName,
            noDoc
        }
    }
}
</script>