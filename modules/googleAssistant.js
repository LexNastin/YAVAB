require('dotenv').config();
const googleAssistant = require('./googleAssistantInstance.js');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class GoogleAssistant {
	constructor(client) {
		this.client = client;
		this.error = function(x) {console.log(chalk.bgRed.black(x))};
		this.warning = function(x) {console.log(chalk.bgYellow.black.underline(x))};
		this.msg = function(x) {console.log(chalk.bgWhiteBright.black(x))};
	}
	
	async init() {
		this.client.assistantInstances['383363277100417027'] = new googleAssistant(process.env.ARCH_TOKENS, 'Arch Assistant', '383363277100417027');
		this.client.assistantInstances['237668270268743682'] = new googleAssistant(process.env.MANUEL_TOKENS, 'Manuel Assistant', '237668270268743682');
		await this.client.assistantInstances['383363277100417027'].init();
		await this.client.assistantInstances['237668270268743682'].init();
	}

	async assistantMessage(message) {
		if (message.channel.id == '812299968920027166' || message.channel.type == 'dm') {			
			if (message.author.bot) return;
			
			if (!this.client.assistantInstances[message.author.id]) {
				this.client.assistantInstances[message.author.id] = new googleAssistant(process.env.DISCORD_TOKENS, `${message.author.username} Assistant`);
				await this.client.assistantInstances[message.author.id].init();
			}
			
			async function checkReady(assistantInstances) {
				if(assistantInstances[message.author.id].ready == false) {
					setTimeout(checkReady, 100); /* this checks the flag every 100 milliseconds*/
				}
			}

			await checkReady(this.client.assistantInstances);

			if(this.client.assistantInstances[message.author.id].loading == true) {
				message.channel.send(`Please wait until the bot responds to your query before requesting a new one <@${message.author.id}>`);
				return;
			}
			
			await this.client.assistantInstances[message.author.id].sendCmd(message.content);
			await message.channel.send(`<@${message.author.id}>`, {
				files: [{
					attachment: `../google_out_${message.author.id}.png`,
					name: 'google.png'
				}]
			})
			.catch((err) => {
				this.error(err);
			});
			fs.unlinkSync(`../google_out_${message.author.id}.png`);
		}
	}

	async assistantCommand(message, dm) {
		if (message.author.bot) return;
		
		if (!this.client.assistantInstances[message.author.id]) {
			this.client.assistantInstances[message.author.id] = new googleAssistant('exclude/tokens.json', `${message.author.username} Assistant`);
		}
		
		async function checkReady(assistantInstances) {
			if(assistantInstances[message.author.id].ready == false) {
				setTimeout(checkReady, 100); /* this checks the flag every 100 milliseconds*/
			}
		}

		await checkReady(this.client.assistantInstances);

		if (!dm) {
			if(this.client.assistantInstances[message.author.id].loading == true) {
				message.channel.send(`Please wait until the bot responds to your query before requesting a new one <@${message.author.id}>`);
				return;
			}
		} else {
			if(this.client.assistantInstances[message.author.id].loading == true) {
				message.author.send(`Please wait until the bot responds to your query before requesting a new one <@${message.author.id}>`);
				return;
			}
		}
		
		await this.client.assistantInstances[message.author.id].sendCmd(message.content);

		if (dm) {
			await message.author.send(`<@${message.author.id}>\n> ${message.content}`, {
				files: [{
					attachment: `../google_out_${message.author.id}.png`,
					name: 'google.png'
				}]
			})
			.catch((err) => {
				this.error(err);
			});
		} else {
			await message.channel.send(`<@${message.author.id}>\n> ${message.content}`, {
				files: [{
					attachment: `../google_out_${message.author.id}.png`,
					name: 'google.png'
				}]
			})
			.catch((err) => {
				this.error(err);
			});
		}
		fs.unlinkSync(`../google_out_${message.author.id}.png`);
	}
}