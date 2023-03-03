import ListItem from '../components/ListItem.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
	title: 'ListItem',
	component: ListItem,
	// More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
	argTypes: {
		title: { type: 'string', description: 'The title of the todo-list item.' },
		date: { type: 'string', description: 'The date the todo-list item was created.' },
		description: { type: 'string', description: 'The content of the todo-list item.' }
	}
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
	// Components used in your story `template` are defined in the `components` object
	components: { ListItem },
	// The story's `args` need to be mapped into the template through the `setup()` method
	setup() {
		return { args };
	},
	// And then the `args` are bound to your component with `v-bind="args"`
	template: '<ListItem v-bind="args" />',
});

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Empty.args = {
};

export const Title = Template.bind({});
Title.args = {
	title: 'Hello World!'
};
