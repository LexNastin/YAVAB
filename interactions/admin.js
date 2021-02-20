const Discord = require('discord.js');
require('dotenv').config();

module.exports = class admin {
	constructor() {
		this.name = 'admin',
		this.descr = 'Admin Commands',
		this.options = [
			{
				name: 'cembed',
				description: 'Create, Edit, or Destroy Embeds',
				type: 2,
				options: [
					{
						name: 'create',
						description: 'Create an Embed',
						type: 1,
						options: [
							{
								name: 'title',
								description: 'Title of Embed',
								type: 3
							},
							{
								name: 'description',
								description: 'Description of Embed',
								type: 3
							},
							{
								name: 'url',
								description: 'URL of Embed',
								type: 3
							},
							{
								name: 'color',
								description: 'Color of Embed',
								type: 4
							},
							{
								name: 'footer',
								description: 'Footer Object',
								type: 3
							},
							{
								name: 'image',
								description: 'Image Object',
								type: 3
							},
							{
								name: 'video',
								description: 'Video Object',
								type: 3
							},
							{
								name: 'author',
								description: 'Author Object',
								type: 3
							},
							{
								name: 'fields',
								description: 'Array of Field Objects',
								type: 3
							}
						]
					},
					{
						name: 'edit',
						description: 'Edit an Embed (Deletes everything currently in the embed.)',
						type: 1,
						options: [
							{
								name: 'message_id',
								description: 'The message ID',
								type: 3,
								required: true
							},
							{
								name: 'title',
								description: 'Title of Embed',
								type: 3
							},
							{
								name: 'description',
								description: 'Description of Embed',
								type: 3
							},
							{
								name: 'url',
								description: 'URL of Embed',
								type: 3
							},
							{
								name: 'color',
								description: 'Color of Embed',
								type: 4
							},
							{
								name: 'footer',
								description: 'Footer Object',
								type: 3
							},
							{
								name: 'image',
								description: 'Image Object',
								type: 3
							},
							{
								name: 'video',
								description: 'Video Object',
								type: 3
							},
							{
								name: 'author',
								description: 'Author Object',
								type: 3
							},
							{
								name: 'fields',
								description: 'Array of Field Objects',
								type: 3
							}
						]
					},
					{
						name: 'delete',
						description: 'Remove an embed from a message',
						type: 1,
						options: [
							{
								name: 'message_id',
								description: 'The message ID',
								type: 3,
								required: true
							}
						]
					}
				]
			},
			{
				name: 'dellog',
				description: 'Log of deleted messages',
				type: 1
			}
		]
	}

	async run(client, interaction, options) {
		// JSON.parse("[" + string + "]")

		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		 }
		
		if(!(interaction.member.permissions & 8)) return;
		let args = {};

		switch (options[0].name) {
			case 'cembed':
				switch (options[0].options[0].name) {
					case 'create':
						if (options[0].options[0].options) {
							options[0].options[0].options.forEach(option => {
								args[option.name] = option.value
							});
						}

						if (args['footer']) {
							args['footer'] = JSON.parse(args['footer']);
						}
						if (args['image']) {
							args['image'] = JSON.parse(args['image']);
						}
						if (args['video']) {
							args['video'] = JSON.parse(args['video']);
						}
						if (args['author']) {
							args['author'] = JSON.parse(args['author']);
						}
						if (args['fields']) {
							args['fields'] = JSON.parse(args['fields']);
						}

						await client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								content: 'Sent'
							}
						}}).catch((err) => {console.log(err)});

						await client.channels.fetch(interaction.channel_id)
						.then(channel => {
							channel.send({
								embed: {
									rich: true,
									title: args['title'],
									description: args['description'],
									url: args['url'],
									color: args['color'],
									footer: args['footer'],
									image: args['image'],
									video: args['video'],
									author: args['author'],
									fields: args['fields']
								}
							})
						}).catch((err) => {console.log(err)});

						await sleep(2000);

						client.api.webhooks(client.user.id, interaction.token).messages('@original').delete().catch((err) => {console.log(err)});

						break;

					case 'edit':
						if (options[0].options[0].options) {
							options[0].options[0].options.forEach(option => {
								args[option.name] = option.value
							});
						}

						await client.channels.fetch(interaction.channel_id)
						.then(channel => {
							channel.messages.fetch(`${args['message_id']}`)
							.then(message => {
								message.edit({
									embed: {
										rich: true,
										title: args['title'],
										description: args['description'],
										url: args['url'],
										color: args['color'],
										footer: args['footer'],
										image: args['image'],
										video: args['video'],
										author: args['author'],
										fields: args['fields']
									}
								})
							}).catch((err) => {console.log(err)});
						}).catch((err) => {console.log(err)});

						await client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								content: 'Edited'
							}
						}}).catch((err) => {console.log(err)});

						await sleep(2000);

						client.api.webhooks(client.user.id, interaction.token).messages('@original').delete().catch((err) => {console.log(err)});

						client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								content: 'editedn\'t'
							}
						}});
						break;
					default:
						break;
				}
				break;

			case 'dellog':
				let delLog = fs.readFileSync('delLog.js');
				console.log(delLog);
				let finalObject = {};

				Object.entries()



				let finalString = '# Deleted Messages Log ( Possibly Contains Private Info, Keep File Private )\n';
				Object.entries(assistantInstances).forEach(([key, value]) => {
					switch(key) {
						case createdTimestamp:
							finalString += `<section>${key}`;
							break;

						default:
							break;
					}
				});
				//console.log(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Deleted Messages</title><script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min.js"></script><script>async function run() {var md = window.markdownit();var result = md.render('${finalString}');await new Promise(r => setTimeout(r, 50))window.document.body.innerHTML = result;}run();</script></head><body></body></html>`)
				break;
		
			default:
				break;
		}
	}
}