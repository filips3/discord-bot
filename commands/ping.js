module.exports = {
	name: 'ping',
	description: 'Ping-pong.',
	usage: '',
	async execute(client, message, args) {
		const pong = await message.channel.send(`Pong!`);
		pong.edit(`Pong! Latency is ${pong.createdTimestamp - message.createdTimestamp}ms`);
	}
};