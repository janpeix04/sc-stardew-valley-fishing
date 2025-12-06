<script>
import BaseLetter from '@/base_components/BaseLetter.vue';
import SmallFont from '@/assets/SmallFont.json';

export default {
    name: 'Letter',
    props: {
        character: {
            type: String,
            required: true
        }
    },
    components: { BaseLetter },
    computed: {
        glyph() {
            return SmallFont.Glyphs[this.character];
        }
    }
};
</script>

<template>
    <BaseLetter 
        :character="character" 
        :x="glyph.BoundsInTexture.X" 
        :y="glyph.BoundsInTexture.Y"
        :width="glyph.BoundsInTexture.Width" 
        :height="glyph.BoundsInTexture.Height"
        :vertical-offset="glyph.Cropping.Y" 
    />
</template>