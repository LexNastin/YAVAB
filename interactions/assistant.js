const Discord = require('discord.js');
require('dotenv').config();

module.exports = class assistant {
	constructor() {
		this.name = 'assistant',
		this.descr = 'Use the Google Assistant anywhere in the server!',
		this.options = [
			{
				name: 'query',
				description: 'What do you want to ask the assistant?',
				type: 3,
				required: true
			},
			{
				name: 'dm',
				description: 'Do you want this to be sent to your DMs? (default: false)',
				type: 5
			}
		]
	}

	async run(client, interaction) {
		let requestedUser = await client.users.fetch(interaction.member.user.id);
		let requestedChannel = await client.channels.fetch(interaction.channel_id);
		let fakeMsg = {
			author: requestedUser,
			channel: requestedChannel,
			content: interaction.data.options[0].value
		}

		if (interaction.data.options[1]) {
			client.googleAssistant.assistantCommand(fakeMsg, interaction.data.options[1].value)
		} else {
			client.googleAssistant.assistantCommand(fakeMsg, false);
		}
		// client.api.interactions(interaction.id, interaction.token).callback.post({data: {
		// 	type: 4,
		// 	data: {
		// 		content: ''
		// 		}
		// 	}
		// });
	}
}