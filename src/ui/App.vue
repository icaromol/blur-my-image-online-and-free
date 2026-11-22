<script setup lang="ts">
import {
	onBeforeUnmount,
	onMounted,
	ref,
	shallowRef,
	useTemplateRef,
} from "vue";
import { MAX_INTENSITY, MIN_INTENSITY } from "../engine/intensity";
import type { Operation } from "../engine/operations";
import { Renderer } from "../engine/renderer";
import { canvasToBlob, downloadBlob, exportFileName } from "../export/download";
import { decodeImage } from "../input/decode";

const stage = useTemplateRef<HTMLDivElement>("stage");
const renderer = shallowRef<Renderer | null>(null);
const fileName = ref("");
const hasImage = ref(false);
const intensity = ref(50);
const operations = ref<Operation[]>([]);
const error = ref("");

onMounted(async () => {
	try {
		const instance = await Renderer.create();
		stage.value?.appendChild(instance.canvas);
		renderer.value = instance;
	} catch {
		error.value =
			"Your browser couldn't start WebGL, which this app needs to render effects.";
	}
});

onBeforeUnmount(() => renderer.value?.destroy());

async function onFileChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file || !renderer.value) return;
	error.value = "";
	try {
		const image = await decodeImage(file);
		renderer.value.setImage(image);
		image.close();
		fileName.value = file.name;
		operations.value = [];
		hasImage.value = true;
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e);
	}
}

function blurEntireImage() {
	operations.value = [
		...operations.value,
		{ effect: "gaussian", intensity: intensity.value },
	];
	renderer.value?.render(operations.value);
}

async function downloadPng() {
	if (!renderer.value) return;
	const blob = await canvasToBlob(renderer.value.toCanvas(), "image/png");
	downloadBlob(blob, exportFileName(fileName.value, "png"));
}
</script>

<template>
	<main class="app">
		<h1>Blur My Image</h1>

		<div class="toolbar">
			<label class="button">
				Choose image
				<input type="file" accept="image/*" class="visually-hidden" @change="onFileChange" />
			</label>

			<label>
				Intensity
				<input v-model.number="intensity" type="range" :min="MIN_INTENSITY" :max="MAX_INTENSITY" />
				<output>{{ intensity }}</output>
			</label>

			<button type="button" :disabled="!hasImage" @click="blurEntireImage">Blur entire image</button>
			<button type="button" :disabled="!hasImage" @click="downloadPng">Download PNG</button>
		</div>

		<p v-if="error" role="alert" class="error">{{ error }}</p>
		<p v-else-if="!hasImage" class="hint">Choose an image to start. It never leaves your device.</p>

		<div ref="stage" class="stage" :hidden="!hasImage" />
	</main>
</template>

<style scoped>
.app {
	max-width: 1200px;
	margin: 0 auto;
	padding: 16px;
	font-family: system-ui, sans-serif;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 12px;
}

.button {
	cursor: pointer;
	padding: 6px 12px;
	border: 1px solid currentColor;
	border-radius: 6px;
}

.button:focus-within {
	outline: 2px solid Highlight;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip-path: inset(50%);
}

.error {
	color: #b00020;
}

.stage {
	margin-top: 16px;
}

.stage :deep(canvas) {
	display: block;
	max-width: 100%;
	max-height: 80vh;
	object-fit: contain;
}
</style>
