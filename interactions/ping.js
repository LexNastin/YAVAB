const Discord = require('discord.js');
require('dotenv').config();

module.exports = class ping {
	constructor() {
		this.name = 'ping',
		this.descr = 'Tests if bot is alive'
	}

	async run(client, interaction, options) {
		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			type: 4,
			data: {
			  content: `Pong <@${interaction.member.user.id}>`
			  }
			}
		});
	}
}