<script>
import BaseSentence from './BaseSentence.vue';
import Letter from './Letter.vue';

export default {
    components: {
        BaseSentence,
        Letter,
    },
    props: {
        text: {
            type: String,
            required: true,
        }
    }
}
</script>

<template>
    <BaseSentence>
        <Letter v-for="character in text" :character="character" />
    </BaseSentence>
</template>