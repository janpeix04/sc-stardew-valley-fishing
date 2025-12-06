<script>
import ButtonCast from '@/assets/img/button_cast.png';
import ButtonStart from '@/assets/img/button_start.png';
import ButtonPull from '@/assets/img/button_pull.png';
import ButtonRetry from '@/assets/img/button_retry.png';
import { SCALE_FACTOR } from '../../public/globals';

const textToImg = {
    "cast": ButtonCast,
    "start": ButtonStart,
    "pull": ButtonPull,
    "retry": ButtonRetry
};

export default {
    props: {
        text: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        }
    },
    emits: ["pressed", "released"],
    data() {
        return {
            SCALE_FACTOR
        };
    },
    methods: {
        mouseDown() {
            if (!this.disabled) {
                this.$emit("pressed");
            }
        },
        mouseUp() {
            if (!this.disabled) {
                this.$emit("released");
            }
        }
    },
    computed: {
        imgSrc() {
            if (this.text in textToImg) {
                return textToImg[this.text];
            }
            return '';
        },
        buttonFilter() {
            return this.disabled ? 'brightness(0.5)' : 'none';
        },
        buttonHoverFilter() {
            return this.disabled ? 'none' : 'brightness(1.3)';
        }
    }
}
</script>

<template>
    <img
        id="actionButton" 
        :src="imgSrc" 
        alt="actionButton"
        ref="actionButton"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
    >
</template>

<style scoped>
    #actionButton {
        position: absolute;
        top: 646px;
        left: 855px;
        image-rendering: pixelated;
        transform: scale(v-bind(SCALE_FACTOR));
        filter: v-bind(buttonFilter);
    }

    #actionButton:hover {
        filter: v-bind(buttonHoverFilter);
    }

    #actionButton:active {
        transform: scale(v-bind(SCALE_FACTOR)) translate(1px, 1px);
    }
</style>