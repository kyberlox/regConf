<template>
    <div class="modal__wrapper">
        <Transition name="modal"
                    appear
                    enter-active-class="animate__animated animate__fadeIn"
                    leave-active-class="animate__animated animate__fadeOut">

            <div class="modal__container"
                 v-if="modalActive && type == 'support'"
                 v-html="defaultHtml">
            </div>
            <div v-else
                 class="modal__container">
                <div class="modal__header">
                    <div class="modal__header-text"></div>
                    <div class="modal__header-close btn-close"
                         @click="closeModal"></div>
                </div>
                <div class="modal__body">
                    <p>Вы можете скачать текущий файл,<br /> либо добавить его в группу для общего ткп:
                    </p>
                </div>
                <div class="modal__footer">
                    <div class="modal__button-group">
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
            default: 'supportt',
        }
    },
    setup(props, { emit }) {
        const defaultHtml = ref(`                <div class="modal__header">
                    <div class="modal__header-text">Поддержка сайта</div>
                    <div class="modal__header-close btn-close"
                         @click="closeModal"></div>
                </div>
                <div class="modal__body">
                    <p>По вопросам технической поддержки обращайтесь по электронной почте:<br />
                        <b>it.dpm@emk.ru</b>
                    </p>

                    <p>Либо по внутренним номерам телефонов: <br /> Газинский Игорь Владимирович -<b>5182</b>
                        /
                        Тимофеев
                        Александр Анатольевич - <b>5182</b>
                    </p>
                </div>`);
        const modalActive = ref(true);
        return {
            closeModal: () => emit('closeModal'),
            modalActive,
            defaultHtml
        }
    }
}
</script>

<style scoped lang="scss">
.modal {
    &__body {
        padding: 20px;
    }

    &__footer {
        border-top: 1px solid #ccc;
        padding: 16px 20px;
    }

    &__button-group {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
    }

    &__button {
        background-color: transparent;
        padding: 8px 16px;
        border: 1px solid var(--emk-brand-color);
        border-radius: 4px;
        color: #333;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 16px;

        &:hover {
            background-color: var(--emk-brand-color);
            color: white;
        }
    }
}
</style>