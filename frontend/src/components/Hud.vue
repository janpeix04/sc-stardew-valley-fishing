<script>
import Minigame from './Minigame.vue';
import BaseCaptures from './BaseCaptures.vue';
import BaseAttempt from './BaseAttempt.vue';
import BaseYellowIndicator from './BaseYellowIndicator.vue';
import BaseActionButton from './BaseActionButton.vue';
import CaughtFishDialog from './CaughtFishDialog.vue';
import {
    ATTEMPTS_DIFFICULTY,
    DIFFICULTY_TO_FISH_TYPE,
    PULL_ROD_TIMEOUT_MS
} from '../../public/globals';

export default {
    components: {
        Minigame,
        BaseActionButton,
        BaseAttempt,
        BaseCaptures,
        BaseYellowIndicator,
        CaughtFishDialog,
    },
    props: {
        showYellowIndicator: {
            type: Boolean,
            required: true
        },
        enableActionButton: {
            type: Boolean,
            required: true,
        }
    },
    emits: ['playerState', 'capturedFish', 'update:showYellowIndicator', 'update:enableActionButton'],
    data() {
        return {
            actionButtonText: 'cast',
            currentDifficulty: 'low',
            isMinigameVisible: false,
            attempts: [],
            showTrigger: 0,
        }
    },
    methods: {
        handleMinigameFinished(isCaptured) {
            this.isMinigameVisible = false;
            this.$emit('playerState', 'reeling_in');
            
            const fishType = isCaptured ? DIFFICULTY_TO_FISH_TYPE[this.currentDifficulty] : '';
            this.$emit('capturedFish', fishType);

            this.actionButtonText = 'cast';
            this.$emit('update:enableActionButton', false);
            this.attempts.push({
                difficulty: this.currentDifficulty,
                successful: isCaptured
            });

            if (this.attempts.length >= ATTEMPTS_DIFFICULTY.length) this.actionButtonText = 'retry';
        },
        handlePressed() {

        },
        handleReleased() {},
        handleClick() {
            if (this.isMinigameVisible || !this.enableActionButton) return;

            switch (this.actionButtonText) {
                case 'cast':
                    this.cast();
                    break;
                case 'start':
                    this.start();
                    break;
                case 'retry':
                    this.retry();
                    break;
                default:
                    break;
            }
        },
        cast() {
            this.$emit('update:showYellowIndicator', false);

            fetch('http://localhost:8081/cast_line')
                .then(_ => {
                    this.$emit("playerState", "casting");
                    this.$emit("update:enableActionButton", false);
                    this.actionButtonText = 'start';
                    this.waitForBite();
                })
                .catch(err => console.log('ERROR:', err));
        },
        start() {},
        retry() {},
        waitForBite() {
            fetch("http://localhost:8081/wait_for_bite")
                .then(_ => {
                    this.showTrigger += 1;
                    setTimeout(() => {
                        if (!this.isMinigameVisible) {
                            this.$emit('playerState', 'reeling_in');
                            this.$emit('capturedFish', '');
                            this.actionButtonText = 'cast';
                            this.$emit('update:enableActionButton', false);
                        }
                    }, PULL_ROD_TIMEOUT_MS);
                })
                .catch(err => console.log(err));
        }
    }
}
</script>

<template>
    <Minigame 
        :visible="isMinigameVisible" 
        :difficulty="currentDifficulty" 
        @finished="handleMinigameFinished"
    />

    <BaseCaptures>
        <BaseAttempt 
            v-for="attempt in attempts"
            :difficulty="attempt.difficulty"
            :successful="attempt.successful"
        />
    </BaseCaptures>

    <CaughtFishDialog :difficulty="currentDifficulty" />

    <BaseYellowIndicator :show-trigger="showTrigger" />

    <BaseActionButton 
        :text="actionButtonText"
        :disabled="!enableActionButton"
        @pressed="handlePressed"
        @released="handleReleased"
        @click="handleClick"
    />
</template>