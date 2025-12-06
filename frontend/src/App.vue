<script>
import BaseBackground from './components/BaseBackground.vue';
import BaseActionButton from './components/BaseActionButton.vue';
import BaseAttempt from './components/BaseAttempt.vue';
import BaseCaptures from './components/BaseCaptures.vue';

export default {
  components: {
    BaseBackground,
    BaseActionButton,
    BaseAttempt,
    BaseCaptures
  }
}
</script>

<template>
  <BaseBackground />
  <BaseActionButton :text="'start'" :disabled="false" />
  <BaseCaptures>
    <BaseAttempt :successful="true" :difficulty="'low'" />
    <BaseAttempt :successful="true" :difficulty="'medium'" />
    <BaseAttempt :successful="true" :difficulty="'high'" />
    <BaseAttempt :successful="true" :difficulty="'legend'" />
  </BaseCaptures>
</template>

<style>
img {
  -webkit-user-drag: none;
}
</style>