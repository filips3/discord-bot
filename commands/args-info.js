module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	usage: '<arg1> <arg2>...',
	permission: 'everyone',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`Command name: ${command}\nArguments:`);
		}
		message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	},
};