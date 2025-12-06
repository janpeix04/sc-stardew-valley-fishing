<script>
import BaseFishIcon from './BaseFishIcon.vue';
import RedCross from '@/assets/img/red_cross.png';
import { DIFFICULTY_TO_FISH_TYPE } from '../../public/globals';

export default {
    components: {
        BaseFishIcon
    },
    props: {
        successful: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            redCross: RedCross,
        };
    },
    computed: {
        fishType() {
            return DIFFICULTY_TO_FISH_TYPE[this.difficulty];
        }
    }
}
</script>

<template>
    <BaseFishIcon v-if="successful" class="resultIcon" :fish-type="fishType" />
    <img v-else :src="redCross" alt="Red cross">
</template>

<style scoped>
.resultIcon {
    vertical-align: top;
}
</style>