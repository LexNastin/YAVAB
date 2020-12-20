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
								name: 'footer_text',
								description: 'Footer Text',
								type: 3
							},
							{
								name: 'footer_icon_url',
								description: 'Footer Icon URL',
								type: 3
							},
							{
								name: 'author_name',
								description: 'Author Name',
								type: 3
							},
							{
								name: 'author_url',
								description: 'Author Name',
								type: 3
							},
							{
								name: 'author_icon_url',
								description: 'Author Name',
								type: 3
							},
							{
								name: 'fields',
								description: 'Array of Fields',
								type: 3
							}
						]
					},
					{
						name: 'edit',
						description: 'Edit an Embed',
						type: 1
					},
					{
						name: 'delete',
						description: 'Delete an Embed',
						type: 1
					}
				]
			}
		]
	}

	async run(client, interaction, options) {
		// JSON.parse("[" + string + "]")
		
		if(!(interaction.member.permissions & 8)) return;

		switch (options[0].name) {
			case 'cembed':
				switch (options[0].options[0].name) {
					case 'create':
						let args = {};

						if (options[0].options[0].options) {
							options[0].options[0].options.forEach(option => {
								args[option.name] = option.value
							});
						}

						if (args['fields']) {
							args['fields'] = JSON.parse(args['fields'])
						}

						client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								embeds: [
									{
										title: args['title'],
										description: args['description'],
										url: args['url'],
										color: args['color'],
										footer: {
											text: args['footer_text'],
											icon_url: args['footer_icon_url']
										},
										author: {
											name: args['author_name'],
											url: args['author_url'],
											icon_url: args['author_icon_url']
										},
										fields: args['fields']
									}
								]
							}
						}});
						break;

					case 'edit':
						client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								content: 'editedn\'t'
							}
						}});

					case 'delete':
						client.api.interactions(interaction.id, interaction.token).callback.post({data: {
							type: 4,
							data: {
								content: 'delete yourself :)'
							}
						}});
				
					default:
						break;
				}
				break;
		
			default:
				break;
		}
	}
}