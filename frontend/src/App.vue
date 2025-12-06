<template>
  <BaseBackground />
  <BasePlayer @animation-finished="handleAnimationFinished" @showing-caught-fish="handleShowingCaughtFish"
    :state="playerState" :captured-fish="capturedFish" />
  <Hud @set-player-state="handleSetPlayerState" @set-captured-fish="handleSetCapturedFish"
    v-model:show-caught-fish-trigger="showFishDialog" v-model:enable-action-button-trigger="enableActionButton" />
</template>

<script>
import BaseBackground from './base_components/BaseBackground.vue';
import BasePlayer from './base_components/BasePlayer.vue';
import Hud from './components/Hud.vue';

export default {
  name: "App",
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
    handleSetCapturedFish(fishId) {
      this.capturedFish = fishId;
    },
    handleSetPlayerState(state) {
      this.playerState = state;
    }
  }
};
</script>

<style>
img {
  -webkit-user-drag: none;
}
</style>
