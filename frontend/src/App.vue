<script>
import BaseBackground from './components/BaseBackground.vue';
import BasePlayer from './components/BasePlayer.vue';

export default {
  components: {
    BaseBackground,
    BasePlayer,
  },
  data() {
    return {
      playerState: 'standing',
      capturedFish: '',
      showFishDialog: false,
      enableActionButton: true,
    }
  },
  methods: {
    handleAnimationFinished() {
      this.enableActionButton = true;
    },
    handleShowingCaughtFish() {
      this.showFishDialog = true;
    },
  }
}
</script>

<template>
  <BaseBackground />
  <BasePlayer
    :state="playerState"
    :captured-fish="capturedFish"
    @animation-finished="handleAnimationFinished"
    @showing-caught-fish="handleShowingCaughtFish"
  />
</template>

<style>
img {
  -webkit-user-drag: none;
}
</style>