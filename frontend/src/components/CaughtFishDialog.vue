<script>
import BaseCaughtFishDialog from '@/base_components/BaseCaughtFishDialog.vue';
import Sentence from '@/components/Sentence.vue';
import { DIFFICULTY_TO_FISH_MAX_LENGTH, DIFFICULTY_TO_FISH_MIN_LENGTH, DIFFICULTY_TO_FISH_NAME, DIFFICULTY_TO_FISH_TYPE } from '../../public/globals';

export default {
    props: ['difficulty'],
    components: {
        BaseCaughtFishDialog,
        Sentence,
    },
    computed: {
        fishName() {
            return (this.difficulty) ? DIFFICULTY_TO_FISH_NAME[this.difficulty] : '';
        },
        inches() {
            const min = DIFFICULTY_TO_FISH_MIN_LENGTH[this.difficulty];
            const max = DIFFICULTY_TO_FISH_MAX_LENGTH[this.difficulty];
            const random = Math.random() * (max - min) + min
            return Math.round(random * 100) / 100;
        },
        fishType() {
            return (this.difficulty) ? DIFFICULTY_TO_FISH_TYPE[this.difficulty] : '';
        }
    }
}
</script>

<template>
    <BaseCaughtFishDialog :fish-type="fishType">
        <template #fishName>
            <Sentence :text="fishName" />
        </template>
        <template #fishInchesLabel>
            <Sentence :text="'Length:'" />
        </template>
        <template #fishInches>
            <Sentence :text="`${inches} in.`" />
        </template>
    </BaseCaughtFishDialog>
</template>

<style scoped></style>