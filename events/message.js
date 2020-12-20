module.exports = {
	name: 'message',
	run: async (client, message) => {
		if(message.content == `you're an idiot!`) message.channel.send(`no u! :joy:`);
	}
}