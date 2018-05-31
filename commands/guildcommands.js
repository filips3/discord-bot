const { Guilds, GuildCommands } = require('../dbObjects.js');
module.exports = {
	name: 'guildcommands',
    aliases: ['guildcomm', 'customcommands', 'customcomm'],
	description: 'List this guilds\' custom commands',
	usage: 'PLACEHOLDER',
	guildOnly: true,
	async execute(client, message, args) {
		const data = [];
		
		data.push('Here\'s a list of this guilds\' custom commands:');
		const commands = await GuildCommands.findAll({
			where: { guild_id: message.guild.id }
		});
		data.push(commands.map(command => command.name).join(', '));
		
		message.channel.send(data, { split: true });
	}
};	