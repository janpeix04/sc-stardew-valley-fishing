<script>
import BaseBackground from './components/BaseBackground.vue';
import BasePlayer from './components/BasePlayer.vue';
import Hud from './components/Hud.vue';

export default {
  components: {
    BaseBackground,
    BasePlayer,
    Hud,
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
    setPlayerState(state) {
      this.playerState = state;
    },
    setCapturedFish(fishType) {
      this.capturedFish = fishType;
    }
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
  <Hud 
    v-model:show-yellow-indicator="showFishDialog"
    v-model:enable-action-button="enableActionButton"
    @player-state="setPlayerState"
    @captured-fish="setCapturedFish"
  />
</template>

<style>
img {
  -webkit-user-drag: none;
}
</style>