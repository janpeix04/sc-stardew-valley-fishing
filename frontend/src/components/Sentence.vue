<script>
import BaseSentence from '@/base_components/BaseSentence.vue';
import Letter from './Letter.vue';

export default {
    props: ['text'],
    components: {
        BaseSentence,
        Letter
    }
}
</script>

<template>
    <BaseSentence>
        <Letter v-for="character in text" :character="character" />
    </BaseSentence>
</template>

<style scoped></style>