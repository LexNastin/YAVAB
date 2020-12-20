const Discord = require('discord.js');
require('dotenv').config();

module.exports = class test_ig {
	constructor() {
		this.name = "PingMe",
		this.alias = ['ping'],
		this.descr = "Tests if bot is alive",
		this.usage = `Just... Type... ${process.env.BOT_PREFIX}ping`
	}

	async run(client, message, args) {
		message.channel.send(`Pong <@${message.author.id}>`)
	}
}