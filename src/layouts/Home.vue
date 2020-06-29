<template>
<div class="home-layout">
  <sidebar />
  <navbar />
  <div class="content">
    <slot />
  </div>
  <player />
</div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Player from '../components/Player.vue';

export default {
  name: 'Home',
  components: {
    Navbar,
    Sidebar,
    Player,
  },
};
</script>

<style scoped>

</style>
