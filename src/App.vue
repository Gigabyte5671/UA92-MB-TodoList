<script lang="ts">
import { defineComponent } from 'vue';
import ListItem from './components/ListItem.vue';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, database } from './main';

const provider = new GoogleAuthProvider();

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
			},
			newItemCounter: 1,
			user: undefined as User | undefined
		};
	},
	methods: {
		addItem() {
			this.todoList.push({
				title: `Untitled ${this.newItemCounter}`,
				date: new Date().toDateString(),
				description: 'Hello World!',
				colour: '',
				selected: false
			});
			this.newItemCounter++;
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
		},
		login(): void {
			signInWithPopup(auth, provider)
				.then((result) => {
					// This gives you a Google Access Token. You can use it to access the Google API.
					const credential = GoogleAuthProvider.credentialFromResult(result);
					const token = credential?.accessToken;
					// The signed-in user info.
					this.user = result.user;
					// IdP data available using getAdditionalUserInfo(result)
					// ...
				}).catch((error) => {
					// Handle Errors here.
					const errorCode = error.code;
					const errorMessage = error.message;
					// The email of the user's account used.
					const email = error.customData.email;
					// The AuthCredential type that was used.
					const credential = GoogleAuthProvider.credentialFromError(error);
					// ...
					console.warn('Sign in failed:', error.code, error.message);
				});
		},
		logout(): void {
			signOut(auth)
				.then(() => {
					// Sign-out successful.
					this.user = undefined;
				}).catch((error) => {
					// An error happened.
					console.warn('Sign out failed:', error);
				});
		}
	},
	mounted() {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				this.user = user;
				const queryReference = await getDocs(collection(database, this.user.uid));
				queryReference.forEach((doc) => {
					const data = doc.data();
					this.todoList.push({
						title: data.title,
						date: data.date,
						description: data.description,
						colour: data.colour,
						selected: false
					});
					this.newItemCounter++;
				});
			} else {
				// Logged out.
			}
		});
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
		<li v-if="user">
			<button @click="logout()">Logout</button>
		</li>
		<li v-else>
			<button @click="login()">Login</button>
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
