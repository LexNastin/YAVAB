const fs = require('fs')

module.exports = {
	name: 'messageDelete',
	run: async (client, message) => {
		let attachments = [];

		currentDelLog = JSON.parse(fs.readFileSync('delLog.json'));

		message.attachments.forEach(attachment => {
			attachments.push(attachment.url);
		});
		message.attachmentUrls = attachments;

		currentDelLog[message.createdTimestamp.toString()] = message
		fs.writeFileSync('delLog.json', JSON.stringify(currentDelLog));
		//fs.writeFileSync(`delLog/${message.author.username}_${message.author.id}_${message.createdTimestamp}.json`, JSON.stringify(message));
	}
}