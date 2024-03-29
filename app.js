//  _______________________________________________________________________________________
// |                                                                                       |
// | YAVAB — By Arch                                                                       |
// | Some credit goes to shoXy, I copied some snippets on a bot that I helped him work on  |
// |                                                                                       |
// | Hopefully this turns out to be an awesome bot that I continue work on, and eventually |
// | finish development... Good look myself                                                |
// |                                                                                       |
// |                                                                           – Arch 2020 |
// |_______________________________________________________________________________________|
//

//  _______________________________________________________________________________________
// |                                                                                       |
// | You have paused sometimes with the development fo this project, but it is going well  |
// | so far, so don't give up... You got this!                                             |
// |                                                                                       |
// |                                                                           – Arch 2021 |
// |_______________________________________________________________________________________|
//

require('dotenv').config();
envErrChk();
const chalk = require('chalk');
const discord = require('discord.js');
const { CommandHandler } = require('djs-commands');
const client = new discord.Client();
const fs = require('fs');
const GoogleAssistant = process.env.ENBALE_ASSISTANT == '1' ? require('./components/googleAssistant.js') : '';
const InteractionHandler = require('./components/interactionHandler.js');

client.servers = {};
client.commands = [];
client.interactions = {};
process.env.ENBALE_ASSISTANT == '1' ? client.assistantInstances = {} : '';

const interactionHandler = new InteractionHandler(client);
process.env.ENBALE_ASSISTANT == '1' ? client.googleAssistant = new GoogleAssistant(client) : '';

//const assistant = new googleAssistant('exclude/tokens.json', 'Assistant');
//const manuelAssistant = new googleAssistant('exclude/manuel_tokens.json', 'Manuel Assistant');
//const archAssistant = new googleAssistant('exclude/arch_tokens.json', 'Arch Assistant');

const CH = new CommandHandler({
	folder: __dirname + '/commands/',
	prefix: [process.env.BOT_PREFIX]
});


const error = function(x) {console.log(chalk.bgRed.black(x))};
const warning = function(x) {console.log(chalk.bgYellow.black.underline(x))};
const msg = function(x) {console.log(chalk.bgWhiteBright.black(x))};


/* (Some testing magikrap 😂)
error(`No sh, really?`);
warning(`Yes, no joke`);
msg(`Ah... ok goodbye`);
*/

app();

function fatalError()
{
	process.exit();
}

function fatalError(err)
{
	error(err);
	process.exit();
}

async function app()
{
	
	await client.login(process.env.BOT_TOKEN)
	.catch((err) => {
		fatalError(err);
	});
	
	process.env.ENBALE_ASSISTANT == '1' ? await client.googleAssistant.init() : '';
	interactionHandler.init();
	
	CH.commands.forEach(x => {
		client.commands.push({ name: x.name, descr: x.descr });
	});
	
	// Attempt At Creating Own Command Handler.
	// let temp = [];
	// let filez = [];
	// file.walkSync('./commands/', (files) => temp = [...temp, files]);
	// while(temp.length) {
	// 	let _ = temp.shift();
	// 	fs.readdir(_, (err, files) => {
	// 		if (err) fatalError(err);
	// 		files.forEach(file => {
	// 			if(fs.statSync(`${_}\\${file}`).isFile()) filez = [...filez, `${_}\\${file}`]
	// 		});
	// 	});
	// }
	
	// console.log(filez);
	// fs.readdir('./commands/', (err, files) => {
	// 	if (err) fatalError(err);
	// 	files.forEach(file => {
	// 		if(fs.statSync(`${file.substring(0, file.lastIndexOf('\\'))}commands\\${file.substring(file.lastIndexOf('\\'), file.length)}`).isDirectory()) return;
	// 		command = require(`./commands/${file}`);
	// 	});
	// });
	
	fs.readdir('./events/', async (err, files) => {
		if (err) return error(err);
		files.forEach(file => {
			let eventFunc = require(`./events/${file}`);
			let eventName = file.split(".")[0];
			client.on(eventName, (...args) => eventFunc.run(client, ...args));
			msg(`Event "${eventName}" loaded`);
		});
	});

	client.categories = fs.readdirSync("./commands/");
	
	client.on('ready', () => {
		msg(`${process.env.BOT_NAME} is ready to use`)
	});
	
	client.ws.on('INTERACTION_CREATE', async interaction => {
		interactionHandler.handleInteraction(interaction);
	});
	
	client.on('message', async message => {
		// if (message.content == `${process.env.BOT_NAME} TEST MODE`)
		// {
		// 	// Hints to   @i.exist._   :D  (fvck her btw)
		// 	message.channel.send(`Yup... I exist`);
		// }

		if (message.author.bot) return;
		if (message.content == `<@${client.user.id}>`) { message.channel.send(`Our current prefix is \`${process.env.BOT_PREFIX}\` <:sideways:775462681075122176>`); return; }

		let args = message.content.split(" ");
		let command = args[0].toLowerCase();
		let cmd = CH.getCommand(command);
		
		if (cmd) {

			try {
				await cmd.run(client, message, args);
			}
			catch (err) {
				error(err);
			}
		}

		if (process.env.ENBALE_ASSISTANT == '1') {
			client.googleAssistant.assistantMessage(message);
		} else {
			if (message.channel.id == process.env.ASSISTANT_CHANNEL_ID || message.channel.type == 'dm') {
				message.channel.send('Sorry, the Google Assistant is currently disabled');
			}
		}
	});
}

function envErrChk()
{
	process.env.BOT_TOKEN = process.env.BOT_TOKEN ?? fatalError(`Token Missing!`);
	process.env.BOT_NAME = process.env.BOT_NAME ?? 'YAVAB';
	process.env.BOT_PREFIX = process.env.BOT_PREFIX ?? '/';
	process.env.GUILD_ID = process.env.GUILD_ID ?? warning('Guild ID Missing!');
	process.env.ENBALE_ASSISTANT = process.env.ENBALE_ASSISTANT ?? '0';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.ASSISTANT_CHANNEL_ID = process.env.ASSISTANT_CHANNEL_ID ?? warning('Assistant Channel ID Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.CLIENT_ID = process.env.CLIENT_ID ?? warning('Assistant Client ID Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.CLIENT_SECRET = process.env.CLIENT_SECRET ?? warning('Assistant Client Secret Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.REDIRECT_URI = process.env.REDIRECT_URI ?? warning('Assistant Redirect URI Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.DISCORD_TOKENS = process.env.DISCORD_TOKENS ?? fatalError('Assistant Default Tokens Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.ARCH_TOKENS = process.env.ARCH_TOKENS ?? warning('Arch\'s Tokens Missing!') : '';
	process.env.ENBALE_ASSISTANT == '1' ? process.env.MANUEL_TOKENS = process.env.MANUEL_TOKENS ?? warning('Manuel\'s Tokens Missing!') : '';
}