<template>
<div class="page-sidebar">
  <div class="sidebar-header">
    <div class="sidebar-header-logo">
      <router-link to="/home">
        <i class="fab fa-kickstarter-k" style="font-size: 35px"></i>
      </router-link>
    </div>
  </div>
  <div class="sidebar-scroll">
    <ul class="sidebar-nav-list">
      <li class="sidebar-nav-item">
        <router-link to="/home" class="sidebar-nav-link">
          <b-icon icon="music-note-beamed"></b-icon>Music
        </router-link>
      </li>
      <li class="sidebar-nav-item">
        <router-link to="/search" class="sidebar-nav-link">
          <b-icon icon="search"></b-icon>Search
        </router-link>
      </li>
      <li class="sidebar-nav-item">
        <router-link to="#favorite" class="sidebar-nav-link">
          <b-icon-heart></b-icon-heart>Favorite
        </router-link>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>

</style>
