<script lang="ts">
import { defineComponent } from 'vue';
import ListItem from './components/ListItem.vue';

interface Item {
	title: string,
	date: string,
	description: string,
	colour: string,
	selected: boolean
}

export default defineComponent({
	name: 'App',
	components: {
		ListItem
	},
	data() {
		return {
			todoList: [] as Item[],
			isDragging: false,
			draggedItem: undefined as number | undefined,
			dragPosition: {
				x: 0,
				y: 0,
				offsetX: 0,
				offsetY: 0
			}
		};
	},
	methods: {
		addItem() {
			this.todoList.push({
				title: 'Untitled',
				date: new Date().toDateString(),
				description: 'Hello World!',
				colour: '',
				selected: false
			});
		},
		removeItem() {
			this.todoList = this.todoList.filter(item => !item.selected);
		},
		dragStart(index: number, event: MouseEvent) {
			console.log(event.target, event.offsetX, event.offsetY);
			this.isDragging = true;
			this.draggedItem = index;
			this.dragPosition.offsetX = event.offsetX;
			this.dragPosition.offsetY = event.offsetY;
		},
		dragEnd() {
			this.isDragging = false;
			this.draggedItem = undefined;
		},
		dragMove(event: MouseEvent) {
			this.dragPosition.x = event.x - this.dragPosition.offsetX;
			this.dragPosition.y = event.y - this.dragPosition.offsetY;
		}
	},
	watch: {
		todoList: {
			handler(newValue) {
				window.localStorage.setItem(
					'todoList',
					JSON.stringify(newValue)
				);
			},
			deep: true
		}
	},
	mounted() {
		this.todoList = JSON.parse(window.localStorage.getItem('todoList') ?? '[]');
	}
});
</script>

<template>
	<h1>Todo</h1>

	<ul class="controls">
		<li>
			<button @click="addItem()">Add</button>
		</li>
		<li>
			<button @click="removeItem()">Remove</button>
		</li>
		<li>
			<button @click="removeItem()">Duplicate</button>
		</li>
	</ul>

	<ol
		id="list"
		@mousemove="dragMove($event)"
		@mouseup="dragEnd()"
	>
		<ListItem
			v-for="(item, index) of todoList"
			v-model:title="item.title"
			:date="item.date"
			v-model:description="item.description"
			v-model:colour="item.colour"
			v-model:selected="item.selected"

			@dragHandleDown="dragStart(index, $event)"
			@dragHandleUp="dragEnd()"
			@dragHandleMove=""

			:style="{
				pointerEvents: isDragging ? 'none' : 'all',
				userSelect: isDragging ? 'none' : 'revert',
				opacity: draggedItem === index ? '0' : '1'
			}"
		></ListItem>
	</ol>

	
	<ListItem
		v-if="draggedItem !== undefined"

		v-model:title="todoList[draggedItem ?? -1].title"
		:date="todoList[draggedItem ?? -1].date"
		v-model:description="todoList[draggedItem ?? -1].description"
		v-model:colour="todoList[draggedItem ?? -1].colour"
		v-model:selected="todoList[draggedItem ?? -1].selected"

		:style="{
			pointerEvents: 'none',
			boxShadow: '2px 6px 30px -9px #0017',
			position: 'absolute',
			top: `${dragPosition.y}px`,
			left: `${dragPosition.x}px`,
			zIndex: '50'
		}"
	></ListItem>
</template>

<style>
</style>
