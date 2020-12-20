// Command Handler

// ToDo:
// [X] Cycle through commands
// [X] Create commands
// [X] On message check if command exists
// [X] If so, do
// [X] Else... Nothing


// --- Create Commands ---
async function createInteractions(name, description) {
	client.api.applications(client.user.id).commands.post({data: {
		name: name,
		description: description
	}});
}

async function createInteractions(name, description, options) {
	client.api.applications(client.user.id).commands.post({data: {
		name: name,
		description: description,
		options: options
	}});
}

function getInteraction(name) {
	let result = client.interactions.indexOf(name);

	if(result) {
		return interactions[result];
	} else {
		return null;
	}
}

var interactions = await walk('./interactions/')

interactions.forEach(interaction => {
	let interactionObject = require(`./${interaction}`);

	if(interactionObject.object) {
		createInteractions(interactionObject.name, interactionObject.descr, interactionObject.options);
	} else {
		createInteractions(interactionObject.name, interactionObject.descr, interactionObject.options);
	}

	client.interactions.push(interactionObject);
});

// --- On Interaction ---

let interactionObject;

if (interaction.data.options) {
	if (interaction.data.options[0].options) {
		interactionObject = getInteraction(`${interaction.data.name} ${interaction.data.options.name} ${interaction.data.options[0].options.name}`);
	} else {
		interactionObject = getInteraction(`${interaction.data.name} ${interaction.data.options.name}`).run(client, interaction);
	}
} else {
	interactionObject = getInteraction(`${interaction.data.name}`).run(client, interaction);
}

if (interactionObject) {
	console.log(interactionObject);
}