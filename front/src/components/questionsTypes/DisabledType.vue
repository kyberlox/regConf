<template>
    <div class="result-display">
        <div class="result-display__content">
            {{ question.value }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        question: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {
        }
    }

}
</script>