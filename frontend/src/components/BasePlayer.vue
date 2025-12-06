<script>
import Catching from '@/assets/img/catching.png';
import Standing from '@/assets/img/standing.png';
import ShowingCrab from '@/assets/img/showing_crab.png';
import ShowingPufferfish from '@/assets/img/showing_pufferfish.png';
import ShowingTuna from '@/assets/img/showing_tuna.png';
import ShowingLegend from '@/assets/img/showing_legend.png';
import ThrowingHook from '@/assets/img/throwing_hook.webp';
import RetrievingHook from '@/assets/img/retrieving_hook.webp';
import RetrievingCrab from '@/assets/img/retrieving_crab.webp';
import RetrievingPufferfish from '@/assets/img/retrieving_pufferfish.webp';
import RetrievingTuna from '@/assets/img/retrieving_tuna.webp';
import RetrievingLegend from '@/assets/img/retrieving_legend.webp';
import { SCALE_FACTOR } from '@/../public/globals';
import { watch } from 'vue';

const FISH_TYPE_TO_RETRIEVING_IMG_SRC = {
    'crab': RetrievingCrab,
    'pufferfish': RetrievingPufferfish,
    'tuna': RetrievingTuna,
    'legend': RetrievingLegend
};

const FISH_TYPE_TO_SHOWING_IMG_SRC = {
    'crab': ShowingCrab,
    'pufferfish': ShowingPufferfish,
    'tuna': ShowingTuna,
    'legend': ShowingLegend
};

export default {
    props: {
        state: {
            type: String,
            required: true,
        },
        capturedFish: {
            type: String,
            required: true,
        }
    },
    emits: ["animationFinished", "showingCaughtFish"],
    data() {
        return {
            SCALE_FACTOR,
            imgSrc: Standing,
            animationFinishedTimeout: null
        }
    },
    methods: {
        async updateAnimation() {
            let animation = ThrowingHook;
            if (this.state === "reeling_in") {
                animation = this.capturedFish in FISH_TYPE_TO_RETRIEVING_IMG_SRC ? FISH_TYPE_TO_RETRIEVING_IMG_SRC[this.capturedFish] : RetrievingHook;
            }
            const response = await fetch(animation);
            const blob = await response.blob();
            this.imgSrc = URL.createObjectURL(blob);

            if (this.animationFinishedTimeout) {
                clearTimeout(this.animationFinishedTimeout);
            }

            this.animationFinishedTimeout = setTimeout(_ => {
                if (this.state !== "reeling_in") {
                    this.$emit("animationFinished");
                    this,this.animationFinishedTimeout = null;
                }

                if (this.capturedFish in FISH_TYPE_TO_SHOWING_IMG_SRC) {
                    this.imgSrc = FISH_TYPE_TO_SHOWING_IMG_SRC[this.capturedFish];
                    this.$emit("showingCaughtFish");
                } else {
                    this.imgSrc = Standing;
                }
            }, 35 * 12);
        },
        watch: {
            state(newValue) {
                if (["casting", "reeling_in"].includes(newValue)) {
                    this.updateAnimation()
                } else if (newValue === "playing") {
                    this.imgSrc = Catching;
                }
            },
            capturedFish(newValue) {
                // This is to reset player sprite when RETRY button is pressed
                if (this.state === "reeling_in" && newValue === '') {
                    this.imgSrc = Standing;
                }
            }
        }
    }
}
</script>

<template>
    <img id="player" :src="imgSrc" alt="Player">
</template>

<style scoped>
#player {
    position: absolute;
    top: 400px;
    left: 788px;
    image-rendering: pixelated;
}
</style>