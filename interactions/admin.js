const Discord = require('discord.js');
const fs = require('fs');
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
				let delLog = JSON.parse(fs.readFileSync(`${process.cwd()}/delLog.json`));
				let finalObject = {};

				Object.entries(delLog).forEach(([key, value]) => {
					finalObject[value.authorID.toString()] = finalObject[value.authorID.toString()] || {};

					let messageObj = {
						messageId: value.id,
						content: {
							content: value.content,
							cleanContent: value.cleanContent
						},
						attachments: value.attachmentUrls,
						embeds: value.embeds,
						lastEdit: value.editedTimestamp,
						pinned: value.pinned,
						tts: value.tts
					}

					finalObject[value.authorID.toString()][key] = messageObj;
				});

				let finalString = '# Deleted Messages Log ( Possibly Contains Private Info, Keep File Private )\\n';

				Object.entries(finalObject).forEach(([key, value]) => {
					let messageStr = '';

					Object.entries(value).forEach(([msgKey, msgValue]) => {
						let embedList = '';
						let attachmentList = '';

						msgValue.embeds.forEach((embed) => {
							embedList += ``
						})

						msgValue.attachments.forEach((attachment) => {
							attachmentList += `- ${attachment}\\n\\n`
						})

						//console.log(finalObject)

						//messageStr += `<details>\\n<summary>${msgKey}</summary>\\n- Message ID: \`${msgValue.messageId}\`\\n<details>\\n<summary>Content</summary>\\n- Content: \`${msgValue.content.content}\`\\n- Clean Content: \`${msgValue.content.cleanContent}\`\\n</details>\\n<details>\\n<summary>Attachments</summary>\\n${attachmentList}\\n</details>\\n<details>\\n<summary>Embeds</summary>\\n${embedList}\\n</details>\\n- Last Edit: \`${msgValue.lastEdit}\`\\n- [${msgValue.pinned ? 'x' : ' '}] Pinned\\n- [${msgValue.tts ? 'x' : ' '}] TTS\\n</details>\\n`
						messageStr += `<details>\\n<summary>${msgKey}</summary>\\n\\n- Message ID: \`${msgValue.messageId}\`\\n\\n<details>\\n<summary>Content</summary>\\n\\n- Content: \`${msgValue.content.content}\`\\n- Clean Content: \`${msgValue.content.cleanContent}\`\\n\\n</details>\\n<details>\\n<summary>Attachments</summary>\\n\\n${attachmentList}\\n\\n</details>\\n<details>\\n<summary>Embeds</summary>\\n\\n${embedList}\\n\\n</details>\\n\\n- Last Edit: \`${msgValue.lastEdit}\`\\n- [${msgValue.pinned ? 'x' : ' '}] Pinned\\n- [${msgValue.tts ? 'x' : ' '}] TTS\\n\\n</details>\\n\\n---\\n\\n`;
					})

					finalString += `<details>\\n<summary>${key}</summary>\\n\\n${messageStr}\\n</details>`
				});
				// fs.writeFileSync('../delLog.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Deleted Messages</title><script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min.js"></script><script>async function run() {var md = window.markdownit({html: true});var result = md.render('${finalString}');await new Promise(r => setTimeout(r, 50));window.document.body.innerHTML = result;}run();</script></head><body></body></html>`)
				break;
		
			default:
				break;
		}
	}
}