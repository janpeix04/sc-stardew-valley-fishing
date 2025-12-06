<script>
import Spool from '@/assets/img/spool.png';
import FishingPopup from '@/assets/img/fishing_popup.png';
import { SCALE_FACTOR } from '../../public/globals';

export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        spoolRotationType: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            spool: Spool,
            fishingPopup: FishingPopup,
            SCALE_FACTOR
        }
    },
    computed: {
        fishingPopupWrapperStyle() {
            return this.visible ? '' : 'opacity: 0;'
        },
        spoolClass() {
            return this.spoolRotationType === "clockwise" ? 'rotateClockWise' : 'rotateAntiClockWise';
        }
    }
}
</script>

<template>
    <div class="fishingPopupWrapper" :style="fishingPopupWrapperStyle">
        <img id="fishingPopupBackground" :src="fishingPopup" alt="Fishing popup">
        <img id="spool" :src="spool" alt="Spool" :class="spoolClass">
        <slot></slot>
    </div>
</template>

<style scoped>
#fishingPopupWrapper {
    position: absolute;
    top: 200px;
    left: 530px;
    image-rendering: pixelated;
}

#fishingPopupBackground {
    position: absolute;
    transform-origin: top left;
    transform: scale(v-bind(SCALE_FACTOR));
}

@keyframes rotateSpoolClockWise {
    from {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(0deg);
    }
    to {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(360deg);
    }
}

@keyframes rotateSpoolAntiClockWise {
    from {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(0deg);
    }
    to {
        transform: scale(v-bind(SCALE_FACTOR)) rotate(-360deg);
    }
}

#spool {
    position: absolute;
    top: 522px;
    left: 37px;
    transform-origin: 50% 100%;
}

.rotateClockWise {
    animation: rotateSpoolClockWise 0.25s linear infinite;
}

.rotateAntiClockWise {
    animation: rotateSpoolAntiClockWise 1s linear infinite;
}
</style>