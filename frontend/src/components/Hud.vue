<script>
import Minigame from './Minigame.vue';
import BaseCaptures from './BaseCaptures.vue';
import BaseAttempt from './BaseAttempt.vue';
import BaseYellowIndicator from './BaseYellowIndicator.vue';
import BaseActionButton from './BaseActionButton.vue';
import CaughtFishDialog from './CaughtFishDialog.vue';
import {
    ATTEMPTS_DIFFICULTY,
    DIFFICULTY_TO_FISH_TYPE,
    PULL_ROD_TIMEOUT_MS
} from '../../public/globals';

export default {
    components: {
        Minigame,
        BaseActionButton,
        BaseAttempt,
        BaseCaptures,
        BaseYellowIndicator,
        CaughtFishDialog,
    },
    props: {
        showYellowIndicator: {
            type: Boolean,
            required: true
        },
        enableActionButton: {
            type: Boolean,
            required: true,
        }
    },
    emits: ['playerState', 'capturedFish', 'update:showYellowIndicator', 'update:enableActionButton'],
}
</script>
