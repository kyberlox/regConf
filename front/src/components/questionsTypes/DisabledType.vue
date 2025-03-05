<template>
    <div class="result-display">
        <span class="result-display__content"
              v-html="question.value">
        </span>
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