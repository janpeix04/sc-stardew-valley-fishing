<script>
import BaseLetter from './BaseLetter.vue';
import SmallFont from '@/assets/SmallFont.json';

export default {
    components: {
        BaseLetter,
    },
    props: {
        character: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            smallFont: SmallFont.Glyphs,
        }
    }
}
</script>

<template>
    <BaseLetter
        :character="character" 
        :x="smallFont[this.character].BoundsInTexture.X"
        :y="smallFont[this.character].BoundsInTexture.Y"
        :width="smallFont[this.character].BoundsInTexture.Width"
        :height="smallFont[this.character].BoundsInTexture.Height"
        :vertical-offset="smallFont[this.character].Cropping.Y"
    />
</template>