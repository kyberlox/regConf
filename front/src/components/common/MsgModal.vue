<template>
    <div class="modal__wrapper">
        <Transition name="modal"
                    appear
                    enter-active-class="animate__animated animate__fadeIn"
                    leave-active-class="animate__animated animate__fadeOut">

            <div class="modal__container"
                 v-if="modalActive">
                <div class="modal__header">
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
                        Александр Анатольевич - <b>5185</b>
                    </p>
                </div>
            </div>

        </Transition>
    </div>
</template>
<script>
import { ref } from 'vue';
export default {
    setup(props, { emit }) {
        const modalActive = ref(true);
        return {
            closeModal: () => emit('closeModal'),
            modalActive
        }
    }
}
</script>