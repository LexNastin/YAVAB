const Discord = require('discord.js');
require('dotenv').config();

module.exports = class echo {
	constructor() {
		this.name = 'echo',
		this.descr = 'Sends back a copy of your message',
		this.options = [
			{
				type: 3,
				name: 'text',
				description: 'The text to send',
				required: true
			}
		]
	}

	async run(client, interaction, options) {
		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			type: 4,
			data: {
			  content: interaction.data.options[0].value
			  }
			}
		  });
	}
}