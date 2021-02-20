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

				let finalString = '';

				let finalObjectArray = Object.entries(finalObject);
				await Promise.all(finalObjectArray.map(async ([key, value]) => {
					let messageStr = '';

					Object.entries(value).forEach(([msgKey, msgValue]) => {
						let embedList = '';
						let attachmentList = '';
						let sentAt = new Date(msgKey*1);
						let lastEdit = new Date(msgValue.lastEdit);

						msgValue.embeds.forEach((embed) => {
							embedList += `<pre class="codeBlock">${JSON.stringify(embed, null, '	').replace(/\n/g, '<br />')}</pre>`
						})

						msgValue.attachments.forEach((attachment) => {
							attachmentList += `<pre class="codeBlock">${attachment}</pre><br />`
						})
						
						//console.log(finalObject)
						
						//messageStr += `<details>\\n<summary>${msgKey}</summary>\\n- Message ID: \`${msgValue.messageId}\`\\n<details>\\n<summary>Content</summary>\\n- Content: \`${msgValue.content.content}\`\\n- Clean Content: \`${msgValue.content.cleanContent}\`\\n</details>\\n<details>\\n<summary>Attachments</summary>\\n${attachmentList}\\n</details>\\n<details>\\n<summary>Embeds</summary>\\n${embedList}\\n</details>\\n- Last Edit: \`${msgValue.lastEdit}\`\\n- [${msgValue.pinned ? 'x' : ' '}] Pinned\\n- [${msgValue.tts ? 'x' : ' '}] TTS\\n</details>\\n`
						//messageStr += `<details>\\n<summary>${msgKey}</summary>\\n\\n- Message ID: \`${msgValue.messageId}\`\\n\\n<details>\\n<summary>Content</summary>\\n\\n- Content: \`${msgValue.content.content}\`\\n- Clean Content: \`${msgValue.content.cleanContent}\`\\n\\n</details>\\n<details>\\n<summary>Attachments</summary>\\n\\n${attachmentList}\\n\\n</details>\\n<details>\\n<summary>Embeds</summary>\\n\\n${embedList}\\n\\n</details>\\n\\n- Last Edit: \`${msgValue.lastEdit}\`\\n- [${msgValue.pinned ? 'x' : ' '}] Pinned\\n- [${msgValue.tts ? 'x' : ' '}] TTS\\n\\n</details>\\n\\n---\\n\\n`;
						// messageStr += `<details>\n<summary>${msgKey}</summary>\n<div class="detailContent">\n<p>Message ID</p>\n<div class="codeBlock">${msgValue.messageId}</div>\n<details>\n<summary>Content</summary>\n<div class="detailContent">\n<p>Content</p>\n<div class="codeBlock">${msgValue.content.content.replace('\`', '\\\`')}</div>\n<p>Clean Content</p>\n<div class="codeBlock">${msgValue.content.cleanContent}</div>\n</div>\n</details>\n<details>\n<summary>Attachments</summary>\n<div class="detailContent">\n${attachmentList}\n</div>\n</details>\n<details>\n<summary>Embeds</summary>\n<div class="detailContent">\n${embedList}\n</div>\n</details>\n<p>Last Edit>/p>\n<div class="codeBlock">${msgValue.lastEdit}</div>\n<p>${msgValue.pinned ? '✓' : 'x'} Pinned</p>\n<p>${msgValue.tts ? '✓' : 'x'} TTS</p>\n</div>\n</details>`;
						messageStr += `<details><summary>Sent At: ${sentAt.getDate().toString().padStart(2, '0')}/${sentAt.getMonth().toString().padStart(2, '0')}/${sentAt.getFullYear().toString().padStart(4, '0')} @ ${sentAt.getHours().toString().padStart(2, '0')}:${sentAt.getMinutes().toString().padStart(2, '0')}</summary><div class="detailContent"><p>Message ID</p><pre class="codeBlock">${msgValue.messageId}</pre><p>Last Edit</p><pre class="codeBlock">${lastEdit.getDate().toString().padStart(2, '0')}/${lastEdit.getMonth().toString().padStart(2, '0')}/${lastEdit.getFullYear().toString().padStart(4, '0')} @ ${lastEdit.getHours().toString().padStart(2, '0')}:${lastEdit.getMinutes().toString().padStart(2, '0')}</pre><p>${msgValue.pinned ? 'Was' : 'Wasn\'t'} Pinned</p><p>${msgValue.tts ? 'Was' : 'Wasn\'t'} TTS</p><details><summary>Content</summary><div class="detailContent"><p>Content</p><pre class="codeBlock">${msgValue.content.content.replace(/\`/g, '\\\`').replace(/\n/g, '<br />')}</pre><p>Clean Content</p><pre class="codeBlock">${msgValue.content.cleanContent.replace(/\`/g, '\\\`').replace(/\n/g, '<br />')}</pre></div></details><details><summary>Attachments</summary><div class="detailContent">${attachmentList}</div></details><details><summary>Embeds</summary><div class="detailContent">${embedList}</div></details></div></details>`
					});
					let user = await client.users.fetch(key);
					finalString += `<details><summary>User: ${user.username}#${user.discriminator}</summary><div class="detailContent">${messageStr}</div></details>`
				}));
				//fs.writeFileSync('delLog.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Deleted Messages</title><script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min.js"></script><script>async function run() {var md = window.markdownit({html: true});var result = md.render('${finalString}');await new Promise(r => setTimeout(r, 50));window.document.body.innerHTML = result;}run();</script></head><body></body></html>`)
				fs.writeFileSync('delLog.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Deleted Message Log</title><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>@keyframes invisiblyGrowFontSize {0% {font-size: 0;opacity: 0;padding: 0%;}100% {font-size: 1em;opacity: 0;padding: 16px;}}@keyframes fadeIn {0% {opacity: 0;}100% {opacity: 1;}}@keyframes invisiblyShringFontSize {100% {font-size: 0;opacity: 0;padding: 0%;}0% {font-size: 1em;opacity: 0;padding: 16px;}}@keyframes fadeOut {100% {opacity: 0;}0% {opacity: 1;}}* {margin: 0;padding: 0;box-sizing: border-box;}body {font-family: Comfortaa, sans-serif;background-color: #2C2F33;color: #FFFFFF;}.heading {display: flex;width: 100%;background-color: #23272A;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;border-color: #000000;border-width: 1px;border-style: solid;transition: height 0.5s ease-in-out;}.heading div {margin-top: 16px;}.heading div h2 {margin-bottom: 16px;}.content {margin: 16px;}details {margin-top: 8px;background-color: #23272A;padding: 0;border-radius: 16px;border-color: #000000;border-width: 1px;border-style: solid;transition: height 0.5s ease-in-out;}summary {padding: 16px;outline: transparent;}details[open] .detailContent {padding: 16px;animation-timing-function: ease-in-out;animation-name: invisiblyGrowFontSize, fadeIn;animation-duration: 500ms, 200ms;animation-delay: 0ms, 500ms;}.codeBlock {background-color: #000000;margin-top: 8px;padding: 16px;border-radius: 16px;}p {margin-top: 8px;}</style></head><body><div class="heading"><svg xmlns="http://www.w3.org/2000/svg" width="128" id="Layer_1" viewBox="0 0 245 240"><style>.st0{fill:#FFFFFF;}</style><path class="st0" d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/><path class="st0" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/></svg><div><h2>Deleted Message Log</h2><h2>Likely To Contain <ins>Personal Info</ins></h2><h2>Keep <ins>Private</ins></h2></div></div><div class="content">${finalString}</div></body></html>`)
				await new Promise(r => {setTimeout(r, 500)})
				let requestedUser = await client.users.fetch(interaction.member.user.id)
				await requestedUser.send({
					files: [{
						attachment: 'delLog.html',
						name: 'delLog.html'
					}]
				});
				fs.unlinkSync('delLog.html');
				break;
		
			default:
				break;
		}
	}
}