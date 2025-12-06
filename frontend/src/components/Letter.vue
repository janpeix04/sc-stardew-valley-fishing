<script>
import BaseLetter from '@/base_components/BaseLetter.vue';
import SmallFont from '@/assets/SmallFont.json';

export default {
    props: ['character'],
    components: {
        BaseLetter,
    },
    computed: {
        Glyphs() {
            return SmallFont.Glyphs;
        }
    }
}
</script>

<template>
    <BaseLetter :character="character" :x="Glyphs[this.character].BoundsInTexture.X"
        :y="Glyphs[this.character].BoundsInTexture.Y" :width="Glyphs[this.character].BoundsInTexture.Width"
        :height="Glyphs[this.character].BoundsInTexture.Height" :vertical-offset="Glyphs[this.character].Cropping.Y" />
</template>

<style scoped></style>