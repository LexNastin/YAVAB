const { walk } = require('./walk.js');
const chalk = require('chalk');

const error = function(x) {console.log(chalk.bgRed.black(x))};
const warning = function(x) {console.log(chalk.bgYellow.black.underline(x))};
const msg = function(x) {console.log(chalk.bgWhiteBright.black(x))};

module.exports = class InteractionHandler {
	constructor(client) {
		this.client = client;
	}

	async init() {
		this.interactions = await walk('./interactions/').catch((err) => {error(err);});

		this.interactions.forEach(async interaction => {
			let interactionClass = require(`../${interaction}`);
			let interactionObject = new interactionClass();
	
			if(interactionObject.options) {
				await this.createInteractions(interactionObject.name, interactionObject.descr, interactionObject.options);
			} else {
				await this.createInteractions(interactionObject.name, interactionObject.descr);
			}
			
			this.client.interactions[interactionObject.name] = interactionObject;
		});
	}

	async createInteractions(name, description) {
		await this.client.api.applications(this.client.user.id).guilds('696473961961357534').commands.post({data: {
			name: name,
			description: description
		}}).catch((err) => {error(err);});
	}
	
	async createInteractions(name, description, options) {
		await this.client.api.applications(this.client.user.id).guilds('696473961961357534').commands.post({data: {
			name: name,
			description: description,
			options: options
		}}).catch((err) => {error(err);});
	}
	
	getInteraction(name) {
		return this.client.interactions[name];
	}

	handleInteraction(interaction) {
		let interactionObject;

		interactionObject = this.getInteraction(`${interaction.data.name}`);
		if (interactionObject) {
			interactionObject.run(this.client, interaction, interaction.data.options);
		}
	}
}