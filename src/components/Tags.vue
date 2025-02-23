<template>
  <section
    v-if="tags?.length"
    class="mt-4"
  >
    <div class="swiper tags__swiper">
      <div class="swiper-wrapper">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          class="swiper-slide tags__swiper-slide mx-1"
        >
          <a
            class="btn btn-sm btn-soft"
            :class="{ 'btn-primary': $selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >{{ tag }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  .tags__swiper-slide {
    width: auto !important;
  }
</style>

<script setup>
  import { selectedTags } from '@src/store';
  import { useStore } from '@nanostores/vue';
  import { watchEffect } from 'vue';
  import Swiper from 'swiper';

  const $selectedTags = useStore(selectedTags);
  const { tags } = defineProps(['tags']);

  watchEffect(() => {
    if (tags?.length) {
      setTimeout(() => {
        new Swiper('.tags__swiper', {
          slidesPerView: 'auto',
          spaceBetween: 0,
        });
      }, 0);
    }
  });

  function toggleTag(tag) {
    if ($selectedTags.value.includes(tag)) {
      selectedTags.set([...$selectedTags.value.filter(t => t !== tag)]);
    } else {
      selectedTags.set([...$selectedTags.value, tag]);
    }
  }
</script>
