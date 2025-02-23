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
			<div v-for="reminder in filteredReminders" :key="reminder.id"
				class="card rounded-sm bg-base-200 shadow-sm p-4 mb-4">
				<div v-if="reminder.created" class="text-end pb-1">
					<div class="badge badge-primary">
						{{ getStringDate(reminder.created) }}
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
			<div class="fixed bottom-0 left-0 bg-transparent w-full">
				<div class="max-w-5xl mx-auto text-end p-4 pe-8">
					<button id="go-top-button" class="btn btn-circle btn-lg me-3">
						<svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
							height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 6v13m0-13 4 4m-4-4-4 4" />
						</svg>
					</button>
					<button class="btn btn-primary btn-circle btn-lg" @click="openAddReminderModal">
						<svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
							height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M5 12h14m-7 7V5" />
						</svg>
					</button>
				</div>
			</div>
			<dialog ref="add-reminder-modal" class="modal modal-bottom sm:modal-middle">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<h3 class="text-lg font-bold">Agregar nuevo Reminder</h3>
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
						<form method="dialog">
							<button class="btn btn-primary" :disabled="!name" @click="addReminder">Agregar</button>
						</form>
					</div>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button>close</button>
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
import { collection, doc, writeBatch, query, orderBy } from 'firebase/firestore';
import { db } from '@fb/client';

const $user = useStore(user);
const $selectedTags = useStore(selectedTags);
const addReminderModal = useTemplateRef('add-reminder-modal');

const name = ref('');
const link = ref('');
const tags = ref('');

const {
	data: reminderUser,
	pending: reminderUserPending,
	// error: reminderUserError,
	// promise: reminderUserPromise
} = useDocument(doc(db, 'reminder', $user.value.uid));
const {
	data: reminders,
	pending: remindersPending,
	// error: remindersError,
} = useCollection(query(collection(db, 'reminder', $user.value.uid, 'reminders'), orderBy('created', 'desc')));

let filteredReminders = computed(() => {
	if (!reminders.value) return null;
	if (!$selectedTags.value.length) return reminders.value;

	return reminders.value.filter(r => r.tags?.length && $selectedTags.value.every(rt => r.tags.includes(rt)));
});

function getStringDate(created) {
	const date = new Date(created);
	let minutes = date.getMinutes();
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${date.toLocaleDateString()} ${date.getHours()}:${minutes}`;
}

function openAddReminderModal() {
	addReminderModal.value.showModal();
}

async function addReminder() {
	if (!name.value) return;

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

	batch.set(doc(collection(db, 'reminder', $user.value.uid, 'reminders')), {
		created: new Date().getTime(),
		name: name.value,
		link: link.value || null,
		tags: tagsList?.length ? tagsList : null,
	});

	await batch.commit();

	name.value = '';
	link.value = '';
	tags.value = '';
}
</script>
