<template>
	<div v-if="reminderUserPending || remindersPending">
		<div class="py-4">
			<div class="skeleton inline-block h-8 w-20 rounded-md mx-1"></div>
			<div class="skeleton inline-block h-8 w-20 rounded-md mx-1"></div>
		</div>
		<div class="skeleton h-32 w-full rounded-lg"></div>
		<div class="skeleton h-32 w-full rounded-lg mt-4"></div>
		<div class="skeleton h-32 w-full rounded-lg mt-4"></div>
	</div>
	<article v-else>
		<Tags :tags="reminderUser?.tags" />
		<section class="mt-4">
			<div v-if="!filteredReminders?.length" role="alert" class="alert">
				<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
					<path d="M12 9h.01" />
					<path d="M11 12h1v4h1" />
				</svg>
				<span>No se encontraron Reminders</span>
			</div>
			<div v-else>
				<div
					v-for="reminder in filteredReminders" :key="reminder.id"
					class="card bg-base-200 shadow p-4 mb-4"
				>
					<div class="text-end pb-1">
						<!-- <div v-if="reminder.created" class="badge badge-primary">
							{{ getStringDate(reminder.created) }}
						</div> -->
						<div class="dropdown dropdown-end ms-3">
							<div ref="dropdown-button" class="btn btn-circle btn-soft btn-xs" tabindex="0" role="button" aria-label="Abrir opciones del recordatorio">
								<svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
								</svg>
							</div>
							<ul
								tabindex="0"
								class="menu dropdown-content bg-base-100 rounded-box w-32 mt-2 p-2 shadow"
							>
								<li @click="openAddOrUpdateReminderModal(reminder)">
									<button class="btn btn-soft btn-sm" aria-label="Editar recordatorio">
										<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
											<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
											<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
											<path d="M16 5l3 3" />
										</svg>
										<span>Editar</span>
									</button>
								</li>
								<li @click="deleteReminder(reminder.id)">
									<button class="btn btn-error btn-soft btn-sm mt-1" aria-label="Eliminar recordatorio">
										<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
											<path d="M4 7l16 0" />
											<path d="M10 11l0 6" />
											<path d="M14 11l0 6" />
											<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
											<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
										</svg>
										<span>Eliminar</span>
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div>
						<a v-if="reminder.link" :href="reminder.link" target="blank" class="btn btn-link p-0">{{ reminder.name }}</a>
						<span v-else>{{ reminder.name }}</span>
					</div>
					<div v-if="reminder.tags?.length" class="mt-4">
						<div v-for="(tag, index) in reminder.tags" :key="index" class="badge badge-soft me-2">
							{{ tag }}
						</div>
					</div>
				</div>
			</div>
			<div class="fixed bottom-0 left-0 w-full z-[1000]">
				<div class="max-w-5xl mx-auto p-4 pb-0">
					<div class="card navbar rounded-b-none flex-row bg-base-300/40 backdrop-blur-md justify-end gap-2">
						<button class="btn btn-soft btn-circle" aria-label="Volver al principio" @click="goTop">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M6 15l6 -6l6 6" />
							</svg>
						</button>
						<button class="btn btn-primary btn-circle" aria-label="Agregar recordatorio" @click="openAddOrUpdateReminderModal(null)">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M12 5l0 14" />
								<path d="M5 12l14 0" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			<!-- <div class="fixed bottom-0 left-0 w-full z-[1000] bg-base-300/40 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
				<div class="max-w-5xl mx-auto flex justify-end p-4">
					<div class="flex gap-2 lg:card lg:flex-row lg:bg-base-300/40 lg:backdrop-blur-md lg:p-2">
						<button class="btn btn-soft btn-circle" aria-label="Volver al principio" @click="goTop">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M6 15l6 -6l6 6" />
							</svg>
						</button>
						<button class="btn btn-primary btn-circle" aria-label="Agregar recordatorio" @click="openAddOrUpdateReminderModal(null)">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M12 5l0 14" />
								<path d="M5 12l14 0" />
							</svg>
						</button>
					</div>
				</div>
			</div> -->
			<dialog ref="add-or-update-reminder-modal" class="modal modal-bottom sm:modal-middle">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Cerrar modal">✕</button>
					</form>
					<form method="dialog" @submit="addOrUpdateReminder">
						<h3 class="text-lg font-bold">{{editedReminder ? 'Editar Reminder' : 'Agregar nuevo Reminder'}}</h3>
						<div class="mt-4">
							<input v-model.trim="name" type="text" placeholder="Nombre*" class="input input-bordered w-full mt-2" />
							<input v-model.trim="link" type="text" placeholder="Links" class="input input-bordered w-full mt-2" />
							<input v-model.trim="tags" type="text" placeholder="Etiquetas" class="input input-bordered w-full mt-2" />
							<div class="mt-3">
								<small class="text-gray-400">(*) Obligatorios</small><br>
								<small class="text-gray-400">Etiquetas: texto separado por comas</small>
							</div>
						</div>
						<div class="modal-action">
							<button type="submit" class="btn btn-primary" aria-label="Guardar recordatorio" :disabled="!name">
								{{editedReminder ? 'Editar' : 'Agregar'}}
							</button>
						</div>
					</form>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button aria-label="Cerrar modal">close</button>
				</form>
			</dialog>
		</section>
	</article>
</template>

<script setup>
import Tags from '@components/Tags.vue';
import { user, selectedTags } from '@src/store';
import { useStore } from '@nanostores/vue';
import { ref, useTemplateRef, computed } from 'vue';
import { useCollection, useDocument } from 'vuefire';
import { collection, doc, writeBatch, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '@fb/client';

const $user = useStore(user);
const $selectedTags = useStore(selectedTags);
const addOrUpdateReminderModal = useTemplateRef('add-or-update-reminder-modal');

const name = ref('');
const link = ref('');
const tags = ref('');
const editedReminder = ref(null);

let reminderUser = ref({});
let reminderUserPending = ref(true);
let reminders = ref([]);
let remindersPending = ref(true);

user.subscribe(u => {
	if (!u) return;

	const reminderUserData = useDocument(doc(db, 'reminder', u.uid));
	const remindersData = useCollection(query(collection(db, 'reminder', u.uid, 'reminders'), orderBy('created', 'desc')), { ssrKey: u.uid });

	reminderUser = reminderUserData.data;
	reminderUserPending = reminderUserData.pending;
	reminders = remindersData.data;
	remindersPending = remindersData.pending;
});

let filteredReminders = computed(() => {
	if (!reminders?.value) return [];
	if (!$selectedTags.value.length) return reminders.value;

	return reminders.value.filter(r => r.tags?.length && $selectedTags.value.every(rt => r.tags.includes(rt)));
});

// function getStringDate(created) {
// 	const date = new Date(created);
// 	let minutes = date.getMinutes();
// 	minutes = minutes < 10 ? `0${minutes}` : minutes;
// 	return `${date.toLocaleDateString()} ${date.getHours()}:${minutes}`;
// }

function goTop() {
	window && window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAddOrUpdateReminderModal(reminder) {
	editedReminder.value = reminder;
	name.value = reminder?.name || '';
	link.value = reminder?.link || '';
	tags.value = reminder?.tags?.join(',') || '';
	addOrUpdateReminderModal.value.showModal();
}

async function addOrUpdateReminder() {
	if (!name.value || !$user.value) return;

	const tagsList = tags.value ? [...new Set(tags.value.split(',').map(t => t ? t.trim().toLowerCase() : null).filter(t => !!t))] : null;
	const batch = writeBatch(db);

	if (!reminderUser?.value && tagsList?.length) {
		batch.set(doc(db, 'reminder', $user.value.uid), {
			tags: [...tagsList]
		});
	} else if (Array.isArray(reminderUser?.value?.tags) && tagsList?.length) {
		const newReminderUserTags = tagsList.filter(nt => !reminderUser.value.tags.includes(nt));
		if (newReminderUserTags?.length) {
			batch.update(doc(db, 'reminder', $user.value.uid), {
				tags: [...new Set([...reminderUser.value.tags, ...newReminderUserTags])]
			});
		}
	}

	if (editedReminder.value) {
		batch.update(doc(db, 'reminder', $user.value.uid, 'reminders', editedReminder.value.id), {
			updated: new Date().getTime(),
			name: name.value,
			link: link.value || null,
			tags: tagsList?.length ? tagsList : null,
		});
	} else {
		batch.set(doc(collection(db, 'reminder', $user.value.uid, 'reminders')), {
			created: new Date().getTime(),
			name: name.value,
			link: link.value || null,
			tags: tagsList?.length ? tagsList : null,
		});
	}

	await batch.commit();

	name.value = '';
	link.value = '';
	tags.value = '';
	editedReminder.value = null;
}

async function deleteReminder(id) {
	if (!$user.value) return;

  await deleteDoc(doc(db, 'reminder', $user.value.uid, 'reminders', id));
} 
</script>
