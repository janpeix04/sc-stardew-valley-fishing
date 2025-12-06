<script>
import BaseBackground from './base_components/BaseBackground.vue';
import BasePlayer from './base_components/BasePlayer.vue';
import Hud from './components/Hud.vue';

export default {
  name: "App",
  components: {
    BaseBackground,
    BasePlayer,
    Hud
  },
  data() {
    return {
      playerState: "standing",
      capturedFish: "",
      showFishDialog: false,
      enableActionButton: true
    };
  },
  methods: {
    onAnimationFinished() {
      this.enableActionButton = true;
    },
    onShowingCaughtFish() {
      this.showFishDialog = true;
    },
    onSetCapturedFish(fishId) {
      this.capturedFish = fishId;
    },
    onSetPlayerState(state) {
      this.playerState = state;
    }
  }
};
</script>

<template>
  <BaseBackground />

  <BasePlayer
    :state="playerState"
    :captured-fish="capturedFish"
    @animation-finished="onAnimationFinished"
    @showing-caught-fish="onShowingCaughtFish"
  />

  <Hud
    v-model:show-caught-fish-trigger="showFishDialog"
    v-model:enable-action-button-trigger="enableActionButton"
    @set-player-state="onSetPlayerState"
    @set-captured-fish="onSetCapturedFish"
  />
</template>

<style>
img {
  -webkit-user-drag: none;
}
</style>
