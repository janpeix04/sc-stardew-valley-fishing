<script>
import DockSeaFloor from '@/assets/img/dock_seafloor.png';
import DockWaves from '@/assets/img/dock_waves.webp';
import DockUpperLayer from '@/assets/img/dock_upperlayer.png';
import { SCALE_FACTOR } from '../../public/globals';

export default {
    data() {
        return {
            dockSeaFloor: DockSeaFloor,
            dockWaves: DockWaves,
            dockUpperLayer: DockUpperLayer,
            SCALE_FACTOR
        };
    }
}
</script>

<template>
    <img :src="dockSeaFloor" alt="Dock sea floor" class="scaled-image overlay-image">
    <img :src="dockWaves" alt="Dock waves" class="scaled-image overlay-image">
    <img :src="dockUpperLayer" alt="Dock upper layer" class="scaled-image overlay-image">
</template>

<style scoped>
.overlay-image {
    position: absolute;
    top: 0;
    left: 0;
}

.scaled-image {
    transform: scale(v-bind(SCALE_FACTOR));
    top: 0;
    left: 0;
    transform-origin: top left;
    object-fit: contain;
    image-rendering: pixelated;
}
</style>