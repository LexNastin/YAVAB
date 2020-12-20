const Discord = require('discord.js');
require('dotenv').config();

module.exports = class author {
	constructor() {
		this.name = 'Author',
		this.alias = ['author'],
		this.descr = 'Tells you who wrote the bot',
		this.usage = `${process.env.BOT_PREFIX}`
	}

	async run(client, message, args) {
		message.channel.send(`The author of this bot is <@383363277100417027>! Thanks <@383363277100417027> :wink:`)
	}
}