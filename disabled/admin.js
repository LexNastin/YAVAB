const Discord = require('discord.js');
require('dotenv').config();

module.exports = class admin {
	constructor() {
		this.name = 'admin',
		this.descr = 'Creates a Custom Embed',
		this.options = []
	}

	async admin_cembed_create(client, interaction, subItem) {
		client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			type: 4,
			data: {
			  content: ''
			  }
			}
		  });
	}
}