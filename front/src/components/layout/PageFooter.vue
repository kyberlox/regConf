<template>
  <footer class="footer-wrapper bg-light mt-auto">
    <div class="footer-container container">
      <div class="row">
        <div class="col-md-6">
          <p>&copy; {{ currentYear }}</p>
        </div>
        <div class="col-md-6 text-md-end">
          <ul class="list-inline">
            <li class="list-inline-item footer__support">
              <div class="footer__support__text"
                   @click="callSupportModal">Поддержка сайта</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  setup(props, { emit }) {

    const callSupportModal = () => {
      emit('callSupportModal');
    }
    return {
      currentYear: (new Date).getFullYear(),
      callSupportModal
    }
  }
}
</script>