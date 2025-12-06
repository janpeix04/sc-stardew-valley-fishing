<script>
import BaseSentence from '@/base_components/BaseSentence.vue';
import Letter from './Letter.vue';

export default {
    name: 'Sentence',
    props: {
        text: {
            type: String,
            required: true
        }
    },
    components: {
        BaseSentence,
        Letter
    }
};
</script>

<template>
    <BaseSentence>
        <Letter 
            v-for="(character, index) in text" 
            :key="index" 
            :character="character" 
        />
    </BaseSentence>
</template>