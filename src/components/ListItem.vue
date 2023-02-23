<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ListItem',
	props: {
		title: { type: String, required: true },
		date: { type: String, required: true },
		description: { type: String, required: true },
		colour: { type: String, required: true },
		selected: { type: Boolean, required: true }
	},
	emits: [
		'update:title',
		'update:description',
		'update:colour',
		'update:selected',
		'dragHandleDown',
		'dragHandleUp',
		'dragHandleMove'
	]
});
</script>

<template>
	<li
		@mousedown="$emit('dragHandleDown', $event)"
		@mouseup="$emit('dragHandleUp')"
		@mousemove="$emit('dragHandleMove', $event)"
	>
		<input
			type="checkbox"
			name="selectItem"
			:value="selected"
			@input="$emit('update:selected', ($event.target as HTMLInputElement).value)"
			@mousedown.stop=""
		>
		<h2>
			<input
				type="text"
				:value="title"
				@input="$emit('update:title', ($event.target as HTMLInputElement).value)"
				@mousedown.stop=""
			>
		</h2>
		<time>{{ date }}</time>
		<div class="handle"></div>
		<p>
			<input
				type="text"
				:value="description"
				@input="$emit('update:description', ($event.target as HTMLInputElement).value)"
				@mousedown.stop=""
			>
		</p>
	</li>
</template>

<style scoped>
li {
	display: grid;
	grid-template-columns: 2rem 1fr 1fr;
	grid-template-rows: 2rem auto;
	place-items: center;
	gap: 1ch;
	margin-bottom: 1rem;
	padding: 0.7ch 0.7ch 2ch;
	background-color: rgb(173, 134, 134);
	border-radius: 0.5rem;
	box-shadow: 0px 3px 20px -7px hsl(140, 72%, 44%);
	cursor: grab;
}

li input[type="text"] {
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
}

li input[type="checkbox"] {
	width: 1.2rem;
	height: 1.2rem;
	margin: unset;
}

li h2 {
	width: 100%;
	margin: unset;
	font-size: larger;
}

li time {
	justify-self: flex-end;
}

li p {
	grid-area: 2 / 2 / 3 / 4;
	width: 100%;
	margin: unset;
}

li .handle {
	width: 1.5rem;
	height: 2rem;
	background: radial-gradient(circle at center, black 1px, transparent 2px);
	background-size: 50% 33%;
	cursor: grab;
	user-select: none;
}
</style>
