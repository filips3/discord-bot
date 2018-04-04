module.exports = {
	name: 'ping',
	description: 'Ping-pong.',
	usage: '',
	execute(message) {
		message.channel.send(`pong`);
	}
};