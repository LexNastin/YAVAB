const Discord = require('discord.js');
require('dotenv').config();

module.exports = class author {
	constructor() {
		this.name = 'author',
		this.descr = 'Tells you who wrote the bot'
	}

	async run(client, interaction, subCommand) {
		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			type: 4,
			data: {
			  content: `The author of this bot is <@383363277100417027>! Thanks <@383363277100417027> :wink:`
			  }
			}
		});
	}
}