const Discord = require('discord.js');
require('dotenv').config();

module.exports = class INTRCTN_NAME {
	constructor() {
		this.name = '',
		this.descr = '',
		this.options = []
	}

	async run(client, interaction) {
		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			type: 4,
			data: {
			  content: ''
			  }
			}
		  });
	}
}