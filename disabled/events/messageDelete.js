module.exports = {
	name: 'messageDelete',
	run: async (client, message) => {
		message.channel.send('', {
			embed: {
				title: "Deleted Message:",
				description: message.content
			}
		});
	}
}