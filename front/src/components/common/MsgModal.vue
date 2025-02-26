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
                        <div class="modal__button">Скачать</div>
                        <div class="modal__button">Добавить</div>
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
    emits: ['closeModal'],
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

        const downloadBodyHtml = `<p>Вы можете скачать текущий файл,<br /> либо добавить его в группу для общего ткп:
                    </p>`;

        const modalActive = ref(true);
        const modalBodyInner = ref(props.type == 'support' ? supportBodyHtml : downloadBodyHtml);

        const closeModal = () => {
            emit('closeModal');
        }
        return {
            closeModal,
            modalActive,
            modalBodyInner
        }
    }
}
</script>