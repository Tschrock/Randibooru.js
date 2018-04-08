/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');

module.exports = class InfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['i'],
			group: 'commands',
			memberName: 'info',
			description: 'Gets basic info about me, including a link to my Discord server and source code.',
			examples: ['info'],
			guarded: true,
		});
	}

	async run(msg) {
		let { guilds, members } = Helpers.getGuildsAndMembers(this.client);

		msg.reply(`**Hey there!** I'm **Randibooru.js**, the next generation of Randibooru! I fetch random images from Derpibooru, the MLP image booru, for your enjoyment.

I'm currently serving ${members} members across ${guilds} guilds, and hope to grow soon!

If you need help getting me to work, try using the \`${msg.guild ? (msg.guild.commandPrefix || this.client.commandPrefix || this.client.options.commandPrefix) : ''}help\` command. From there, you can see a list of all the commands I have available.

**Want to see my source code?** Here ya go!
https://github.com/BytewaveMLP/Randibooru.js

**Join my Discord server!**
${this.client.config.bot.invite}`);
	}
};