module.exports = {
	name: 'sayd',
	aliases: ['saydelete'],
	description: 'Copy your message and remove it.',
	usage: '<message>...',
	execute(message, args) {
		message.delete();
		if (!args.length) {
			return message.channel.send(``);
		}
		const msg = args.join(' ');
		message.channel.send(`${msg}`);
	}
};