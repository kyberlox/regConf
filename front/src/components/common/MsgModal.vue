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
        const supportBodyHtml = `                    <p>По вопросам технической поддержки обращайтесь по электронной почте:<br />
                        <b>it.dpm@emk.ru</b>
                    </p>

                    <p>Либо по внутренним номерам телефонов: <br /> Газинский Игорь Владимирович -<b>5182</b>
                        /
                        Тимофеев
                        Александр Анатольевич - <b>5182</b>
                    </p>`;

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