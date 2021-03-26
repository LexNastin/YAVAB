const fs = require('fs')

module.exports = {
	name: 'messageDelete',
	run: async (client, messages) => {
		let attachments = [];

		currentDelLog = JSON.parse(fs.readFileSync('persist.delLog.json'));

		await messages.forEach(message => {
			message.attachments.forEach(attachment => {
				attachments.push(attachment.url);
			});
			message.attachmentUrls = attachments;

			currentDelLog[message.createdTimestamp.toString()] = message
		});
		fs.writeFileSync('persist/delLog.json', JSON.stringify(currentDelLog));
		//fs.writeFileSync(`delLog/${message.author.username}_${message.author.id}_${message.createdTimestamp}.json`, JSON.stringify(message));
	}
}