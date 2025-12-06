<script>
import BaseMinigame from '@/base_components/BaseMinigame.vue';
import BaseCatchBar from '@/base_components/BaseCatchBar.vue';
import BaseFish from '@/base_components/BaseFish.vue';
import BaseProgressBar from '@/base_components/BaseProgressBar.vue';
import {
    CATCH_BAR_INITIAL_POSITION,
    DIFFICULTY_TO_FISH_SPEED,
    FISH_MAX_POS,
    GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY,
    PROGRESS_BAR_INITIAL_POSITION
} from '../../public/globals';

export default {
    name: 'Minigame',
    props: {
        visible: { type: Boolean, required: true },
        difficulty: { type: String, required: true }
    },
    emits: ['finished'],
    components: {
        BaseMinigame,
        BaseCatchBar,
        BaseFish,
        BaseProgressBar
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
        };
    },
    computed: {
        fishSpeed() {
            return this.difficulty ? DIFFICULTY_TO_FISH_SPEED[this.difficulty] : 0;
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
        processCatchBarInfo(data) {
            this.catchBarDirection = data.direction;
            this.catchBarLastSwapAt = data.lastSwapAt;
            this.catchBarLastSwapPosition = data.lastSwapPosition;
        },
        processFishInfo(data) {
            this.fishDirection = data.direction;
            this.fishLastSwapAt = data.lastSwapAt;
            this.fishLastSwapPosition = data.lastSwapPosition;
        },
        processProgressBarInfo(data) {
            if (data.state === 'in_progress') {
                this.progressBarDirection = data.direction;
                this.progressBarLastSwapAt = data.lastSwapAt;
                this.progressBarLastSwapPosition = data.lastSwapPosition;
                this.spoolRotation = data.direction === 'up' ? 'clockwise' : 'anticlockwise';
            } else {
                clearInterval(this.getMinigameInfoInterval);
                this.resetAllComponents();
                this.$emit('finished', data.state !== 'failed');
            }
        },
        cleanUp() {
            clearInterval(this.getMinigameInfoInterval);
            this.resetAllComponents();
        }
    },
    mounted() {
        this.socket = new WebSocket('ws://localhost:8080');

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.isWebSocketEstablished = true;
        };

        this.socket.onmessage = (event) => {
            if (!event.data) return;

            const message = JSON.parse(event.data);
            switch (message.type) {
                case 'catchBarInfo':
                    this.processCatchBarInfo(message.data);
                    break;
                case 'fishInfo':
                    this.processFishInfo(message.data);
                    break;
                case 'progressBarInfo':
                    this.processProgressBarInfo(message.data);
                    break;
            }
        };

        this.socket.onclose = () => {
            this.isWebSocketEstablished = false;
        };
    },
    beforeUnmount() {
        this.cleanUp();
        if (this.socket) this.socket.close();
    },
    watch: {
        visible(newVal, oldVal) {
            if (!newVal && oldVal) {
                this.cleanUp();
            } else if (newVal && !oldVal && !this.isWebSocketEstablished) {
                this.getMinigameInfoInterval = setInterval(async () => {
                    try {
                        const response = await fetch('http://localhost:8081/get_mini_game_info');
                        if (!response.ok) return;

                        const data = await response.json();
                        if (!data) return;

                        this.processCatchBarInfo(data.catchBarInfo);
                        this.processFishInfo(data.fishInfo);
                        this.processProgressBarInfo(data.progressBarInfo);
                    } catch (err) {
                        console.error('Error fetching minigame info:', err);
                    }
                }, GET_MINI_GAME_INFO_RETRIEVE_FREQUENCY);
            }
        }
    }
};
</script>

<template>
    <BaseMinigame :visible="visible" :spool-rotation-type="spoolRotation">
        <BaseCatchBar 
            :direction="catchBarDirection" 
            :last-swap-at="catchBarLastSwapAt"
            :last-swap-position="catchBarLastSwapPosition" 
        />
        <BaseFish 
            :direction="fishDirection" 
            :last-swap-at="fishLastSwapAt" 
            :last-swap-position="fishLastSwapPosition"
            :speed="fishSpeed" 
            :is-legend="isLegend" 
        />
        <BaseProgressBar 
            :direction="progressBarDirection" 
            :last-swap-at="progressBarLastSwapAt"
            :last-swap-position="progressBarLastSwapPosition" 
        />
    </BaseMinigame>
</template>