<template>
  <section
    v-if="tags?.length"
    class="flex items-center gap-2 mt-3 py-4"
  >
    <div>
      <button class="btn btn-soft btn-circle btn-sm" aria-label="Editar etiquetas" @click="openUpdateTagsModal">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
          <path d="M16 5l3 3" />
        </svg>
      </button>
    </div>
    <div class="overflow-auto">
      <swiper
        :slidesPerView="'auto'"
        :spaceBetween="0"
      >
        <swiper-slide
          v-for="(tag, index) in tags"
          :key="index"
          class="swiper-slide__w-auto"
        >
          <div class="pe-2">
            <div
              role="button"
              class="btn btn-sm btn-soft"
              aria-label="Filtrar recordatorios por etiqueta"
              :class="{ 'btn-primary': $selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
  <dialog ref="update-tags-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Cerrar modal">✕</button>
      </form>
      <form method="dialog" @submit="updateTags">
        <h3 class="text-lg font-bold">Editar etiquetas</h3>
        <div class="mt-4">
          <div
            v-for="(tag, index) in tags"
            :key="index"
            class="badge badge-soft cursor-pointer m-1"
            :class="{ 'badge-primary': deletedTags.includes(tag) }"
            @click="toggleDeletedTag(tag)"
          >{{ tag }}</div>
          <div class="mt-3">
            <small class="text-gray-400">(*) Selecciona las etiquetas que deseas eliminar</small><br>
          </div>
        </div>
        <div class="modal-action">
          <button type="submit" class="btn btn-primary" aria-label="Guardar etiquetas" :disabled="!deletedTags?.length">Editar</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button aria-label="Cerrar modal">close</button>
    </form>
  </dialog>
</template>

<script setup>
  import { doc, updateDoc } from 'firebase/firestore'
  import { ref, useTemplateRef } from 'vue';
  import { useStore } from '@nanostores/vue';
  import { user, selectedTags } from '@src/store';
  import { db } from '@fb/client';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/css';

  const $user = useStore(user);
  const $selectedTags = useStore(selectedTags);
  const { tags } = defineProps(['tags']);

  const updateTagsModal = useTemplateRef('update-tags-modal');
  const deletedTags = ref([]);

  function toggleTag(tag) {
    if ($selectedTags.value.includes(tag)) {
      selectedTags.set([...$selectedTags.value.filter(t => t !== tag)]);
    } else {
      selectedTags.set([...$selectedTags.value, tag]);
    }
  }

  function toggleDeletedTag(tag) {
    if (deletedTags.value.includes(tag)) {
      deletedTags.value = [...deletedTags.value.filter(t => t !== tag)];
    } else {
      deletedTags.value = [...deletedTags.value, tag];
    }
  }

  function openUpdateTagsModal() {
    updateTagsModal.value.showModal();
  }

  async function updateTags() {
    if (!$user.value || !deletedTags.value?.length) return;

    await updateDoc(doc(db, 'reminder', $user.value.uid), {
      tags: [...new Set([...tags.filter(t => !deletedTags.value.includes(t))])]
    });

    selectedTags.set([...$selectedTags.value.filter(t => !deletedTags.value.includes(t))]);
    deletedTags.value = [];
  }
</script>
