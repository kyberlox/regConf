<template>
    <div class="engine-selector content-container">
        <div class="engine-selector__grid">
            <div class="engine-selector__item"
                 v-for="item in homePageEngines"
                 :key="item.id">
                <RouterLink :to="{ name: item.route }"
                            class="engine-card engine-card--glass">
                    <div class="engine-card__image"
                         :style="{ backgroundImage: `url(${item.imgSrc})` }"></div>
                    <div class="engine-card__body">
                        <h5 class="engine-card__title">{{ item.title }}</h5>
                        <p class="engine-card__description">
                            {{ item.description }}
                        </p>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import homePageEngines from '@/assets/staticJsons/homePageEngines.json';
export default {
    setup() {
        const router = useRouter();
        return {
            router,
            homePageEngines
        }
    }
}
</script>