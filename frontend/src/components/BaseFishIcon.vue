<script>
import Crab from '@/assets/img/crab.png';
import Pufferfish from '@/assets/img/pufferfish.png';
import Tuna from '@/assets/img/tuna.png';
import Legend from '@/assets/img/legend.png';

const fishTypeToFishSrc = {
    "crab": Crab,
    "pufferfish": Pufferfish,
    "tuna": Tuna,
    "legend": Legend
}

export default {
    props: {
        fishType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            crab: Crab,
            pufferfish: Pufferfish,
            tuna: Tuna,
            legend: Legend
        };
    },
    computed: {
        imgSrc() {
            return fishTypeToFishSrc[this.fishType];
        }
    }
}
</script>

<template>
    <img :src="imgSrc" :alt="fishType">
</template>