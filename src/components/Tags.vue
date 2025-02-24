<template>
  <section
    v-if="tags?.length"
    class="mt-4"
  >
    <div>
      <div>
        <div
          v-for="(tag, index) in tags"
          :key="index"
          class="inline-block m-1"
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

<script setup>
  import { selectedTags } from '@src/store';
  import { useStore } from '@nanostores/vue';

  const $selectedTags = useStore(selectedTags);
  const { tags } = defineProps(['tags']);

  function toggleTag(tag) {
    if ($selectedTags.value.includes(tag)) {
      selectedTags.set([...$selectedTags.value.filter(t => t !== tag)]);
    } else {
      selectedTags.set([...$selectedTags.value, tag]);
    }
  }
</script>
