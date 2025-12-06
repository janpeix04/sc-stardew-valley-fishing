<script>
import BaseMinigame from '@/base_components/BaseMinigame.vue';
import BaseCatchBar from '@/base_components/BaseCatchBar.vue';
import BaseFish from '@/base_components/BaseFish.vue';
import BaseProgressBar from '@/base_components/BaseProgressBar.vue';
import { CATCH_BAR_INITIAL_POSITION, DIFFICULTY_TO_FISH_SPEED, FISH_MAX_POS, GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY, PROGRESS_BAR_INITIAL_POSITION } from '../../public/globals';

export default {
    props: ['visible', 'difficulty'],
    emits: ['finished'],
    components: {
        BaseMinigame,
        BaseCatchBar,
        BaseFish,
        BaseProgressBar,
    },
    data() {
        return {
            spoolRotation: '',
            catchBarDirection: 'down',
            catchBarLastSwapAt: null,
            catchBarLastSwapPosition: null,
            fishDirection: 'down',
            fishLastSwapAt: null,
            fishLastSwapPosition: null,
            progressBarDirection: 'down',
            progressBarLastSwapAt: null,
            progressBarLastSwapPosition: null,
            isWebSocketEstablished: false,
            getMinigameInfoInterval: null,
        }
    },
    computed: {
        fishSpeed() {
            return (this.difficulty) ? DIFFICULTY_TO_FISH_SPEED[this.difficulty] : 0;
        },
        isLegend() {
            return this.difficulty === 'legend';
        }
    },
    methods: {
        resetAllComponents() {
            this.spoolRotation = 'clockwise';
            this.catchBarDirection = 'down';
            this.catchBarLastSwapAt = Date.now();
            this.catchBarLastSwapPosition = CATCH_BAR_INITIAL_POSITION;
            this.fishDirection = 'down';
            this.fishLastSwapAt = Date.now();
            this.fishLastSwapPosition = FISH_MAX_POS;
            this.progressBarDirection = 'down';
            this.progressBarLastSwapAt = Date.now();
            this.progressBarLastSwapPosition = PROGRESS_BAR_INITIAL_POSITION;
        },
        processCatchBarInfo(dict) {
            this.catchBarDirection = dict.direction;
            this.catchBarLastSwapAt = dict.lastSwapAt;
            this.catchBarLastSwapPosition = dict.lastSwapPosition;
        },
        processFishInfo(dict) {
            this.fishDirection = dict.direction;
            this.fishLastSwapAt = dict.lastSwapAt;
            this.fishLastSwapPosition = dict.lastSwapPosition;
        },
        processProgressBarInfo(dict) {
            if (dict.state === 'in_progress') {
                this.progressBarDirection = dict.direction;
                this.progressBarLastSwapAt = dict.lastSwapAt;
                this.progressBarLastSwapPosition = dict.lastSwapPosition;
                this.spoolRotation = (dict.direction === 'up') ? 'clockwise' : 'anticlockwise';
            } else {
                clearInterval(this.getMinigameInfoInterval);
                this.resetAllComponents();
                this.$emit('finished', (dict.state !== 'failed'));

            }
        },
        cleanUp() {
            clearInterval(this.getMinigameInfoInterval);
            this.resetAllComponents();
        }
    },
    mounted() {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('WebSocket connection estblished');
            this.isWebSocketEstablished = true;
        }

        socket.onmessage = (data) => {
            if (data) {
                const dictData = JSON.parse(data.data);
                console.log(dictData)
                switch (dictData.type) {
                    case 'catchBarInfo':
                        this.processCatchBarInfo(dictData.data);
                        break;
                    case 'fishInfo':
                        this.processFishInfo(dictData.data);
                        break;
                    case 'progressBarInfo':
                        this.processProgressBarInfo(dictData.data);
                        break;
                    default:
                        break;
                }
            }
        }

        socket.onclose = () => {
            this.isWebSocketEstablished = false;
        }
    },
    beforeUnmount() {
        this.cleanUp();
    },
    watch: {
        visible(newVal, oldVal) {
            if (!newVal && oldVal) {
                this.cleanUp();
            } else if (newVal && !oldVal) {
                if (!this.isWebSocketEstablished) {
                    this.getMinigameInfoInterval = setInterval(async () => {
                        const response = await fetch('http://localhost:8081/get_mini_game_info');

                        if (response.ok) {
                            const data = await response.json();

                            if (data) {
                                this.processCatchBarInfo(data.catchBarInfo);
                                this.processFishInfo(data.fishInfo);
                                this.processProgressBarInfo(data.progressBarInfo);
                            }
                        }
                    }, GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY);
                }
            }
        }
    }
}
</script>

<template>
    <BaseMinigame :visible="visible" :spool-rotation-type="spoolRotation">
        <BaseCatchBar :direction="catchBarDirection" :last-swap-at="catchBarLastSwapAt"
            :last-swap-position="catchBarLastSwapPosition" />
        <BaseFish :direction="fishDirection" :last-swap-at="fishLastSwapAt" :last-swap-position="fishLastSwapPosition"
            :speed="fishSpeed" :is-legend="isLegend" />
        <BaseProgressBar :direction="progressBarDirection" :last-swap-at="progressBarLastSwapAt"
            :last-swap-position="progressBarLastSwapPosition" />
    </BaseMinigame>
</template>

<style scoped></style>