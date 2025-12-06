<script>
import BaseMinigame from './BaseMinigame.vue';
import BaseCatchBar from './BaseCatchBar.vue';
import BaseFish from './BaseFish.vue';
import BaseProgressBar from './BaseProgressBar.vue';
import { 
    CATCH_BAR_INITIAL_POSITION,
    DIFFICULTY_TO_FISH_SPEED,
    FISH_MAX_POS,
    GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY,
    PROGRESS_BAR_INITIAL_POSITION
} from '../../public/globals';

export default {
    components: {
        BaseMinigame,
        BaseCatchBar,
        BaseFish,
        BaseProgressBar,
    },
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        difficulty: {
            type: String,
            required: true
        }
    },
    emits: ['finished'],
    data() {
        return {
            spoolRotation: '',
        }
    }
}
</script>

<template>
    <BaseMinigame :visible="visible" :spool-rotation-type="spoolRotation">
        <BaseCatchBar :direction="catchBarDirection" :last-swap-at="catchBarLastSwapAt" :last-swap-position="catchBarLastSwapPosition" />

        <BaseFish :direction="fishDirection" :last-swap-at="fishLastSwapAt" :last-swap-position="fishLastSwapPosition" :speed="fishSpeed" :is-legend="isLegend" />

        <BaseProgressBar :direction="progressBarDirection" :last-swap-at="progressBarLastSwapAt" :last-swap-position="progressBarLastSwapPosition" />
    </BaseMinigame>
</template>