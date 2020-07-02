<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
const defaultLayout = 'default';

export default {
  watch: {
    $route() {
      if (this.theme === 'dark') {
        this.$vs.setTheme('dark');
      } else {
        this.$vs.setTheme('light');
      }
    },
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    layout() {
      return `${this.$route.meta.layout || defaultLayout}-layout`;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
