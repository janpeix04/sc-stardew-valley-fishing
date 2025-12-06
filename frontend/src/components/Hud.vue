<script>
import Minigame from '@/components/Minigame.vue';
import BaseCaptures from '@/base_components/BaseCaptures.vue';
import BaseAttempt from '@/base_components/BaseAttempt.vue';
import CaughtFishDialog from '@/components/CaughtFishDialog.vue';
import BaseYellowIndicator from '@/base_components/BaseYellowIndicator.vue';
import BaseActionButton from '@/base_components/BaseActionButton.vue';
import { ATTEMPTS_DIFFICULTY, DIFFICULTY_TO_FISH_TYPE, PULL_ROD_TIMEOUT_MS } from '../../public/globals';

export default {
    props: ['showCaughtFishTrigger', 'enableActionButtonTrigger'],
    emits: ['setPlayerState', 'setCapturedFish', 'update:showCaughtFishTrigger', 'update:enableActionButtonTrigger'],
    components: {
        Minigame,
        BaseCaptures,
        BaseAttempt,
        CaughtFishDialog,
        BaseYellowIndicator,
        BaseActionButton,
    },
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
            this.$emit('setPlayerState', 'reeling_in');
            const fishId = (isCaptured) ? DIFFICULTY_TO_FISH_TYPE[this.currentDifficulty] : '';
            this.$emit('setCapturedFish', fishId);
            this.actionButtonText = 'cast';
            this.$emit('update:enableActionButtonTrigger', false);
            this.attempts.push({ difficulty: this.currentDifficulty, successful: isCaptured });
            if (this.attempts.length >= ATTEMPTS_DIFFICULTY.length) {
                this.actionButtonText = 'retry';
            }
        },
        handleClick() {
            if (this.isMinigameVisible || !this.enableActionButtonTrigger) {
                return;
            }

            switch (this.actionButtonText) {
                case 'cast':
                    this.handleCast();
                    break;
                case 'start':
                    this.handleStart();
                    break;
                case 'retry':
                    this.handleRetry();
                    break;
                default:
                    break;
            }
        },
        async handleCast() {
            this.$emit('update:showCaughtFishTrigger', false);

            try {
                const response = await fetch('http://localhost:8081/cast_line');

                if (!response.ok) {
                    return;
                }

                this.$emit('setPlayerState', 'casting');
                this.actionButtonText = 'start';
                this.$emit('update:enableActionButtonTrigger', false);
                this.waitForBite();
            } catch (error) {
                return;
            }
        },
        async waitForBite() {
            try {
                const response = await fetch('http://localhost:8081/wait_for_bite');

                if (!response.ok) {
                    return;
                }

                this.showTrigger += 1;
                setTimeout(() => {
                    if (!this.isMinigameVisible) {
                        this.$emit('setPlayerState', 'reeling_in');
                        this.$emit('setCapturedFish', '');
                        this.actionButtonText = 'cast';
                        this.$emit('update:enableActionButtonTrigger', false);
                    }
                }, PULL_ROD_TIMEOUT_MS);
            } catch (error) {
                return;
            }
        },
        async handleStart() {
            try {
                const response = await fetch('http://localhost:8081/reel_in');

                const data = await response.json();

                if (data.errorCode === 'standing') {
                    this.$emit('setPlayerState', 'reeling_in');
                    this.$emit('setCapturedFish', '');
                    this.actionButtonText = 'cast';
                    this.$emit('update:enableActionButtonTrigger', false);
                } else if (data.difficulty) {
                    this.$emit('setPlayerState', 'playing');
                    this.isMinigameVisible = true;
                    this.currentDifficulty = data.difficulty;
                    this.actionButtonText = 'pull';
                } else {
                    return;
                }
            } catch (error) {
                return;
            }
        },
        async handleRetry() {
            this.$emit('update:showCaughtFishTrigger', false);
            this.attempts = [];
            this.$emit('setCapturedFish', '');
            this.actionButtonText = 'cast';
        },
        async handlePressed() {
            if (this.isMinigameVisible) {
                const response = await fetch('http://localhost:8081/move_catch_bar_up');
            }
        },
        async handleReleased() {
            if (this.isMinigameVisible) {
                const response = await fetch('http://localhost:8081/stop_moving_catch_bar_up');
            }
        }
    },
    computed: {
        disableActionButton() {
            return !this.enableActionButtonTrigger;
        }
    }
}
</script>

<template>
    <Minigame @finished="handleMinigameFinished" :visible="isMinigameVisible" :difficulty="currentDifficulty" />

    <BaseCaptures>
        <BaseAttempt v-for="item in attempts" :difficulty="item.difficulty" :successful="item.successful" />
    </BaseCaptures>

    <CaughtFishDialog v-if="showCaughtFishTrigger" :difficulty="currentDifficulty" />

    <BaseYellowIndicator :show-trigger="showTrigger" />

    <BaseActionButton @click="handleClick" @pressed="handlePressed" @released="handleReleased" :text="actionButtonText"
        :disabled="disableActionButton" />
</template>

<style scoped></style>