<template>
    <div class="data-display">
        <div class="data-display__content">
            {{ question.value }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        question: {
            type: String,
            required: true,
        },
        setup() {
            return {
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.data-display {
    background: #dbdcdd8a;
    border-radius: 8px;

    &__header {
        padding: 12px 16px;
        border-bottom: 1px solid #e9ecef;
    }

    &__content {
        padding: 16px;
        color: #212529;
    }
}
</style>