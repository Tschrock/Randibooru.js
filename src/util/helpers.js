const request = require('request');

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Gets the current guild and UNIQUE member counts.
 *
 * @param {CommandoClient} client - The Discord.JS-Commando Client object
 * @returns {object} - An object containing two properties, guilds and members, each representing the associated counts.
 */
exports.getGuildsAndMembers = async (client) => {
	return new Promise((resolve, reject) => {
		// Algorithm provided by CyberPon3
		// https://github.com/CyberPon3
		let members = client.guilds.reduce(
			(acc, guild) => {
				guild.members
					.filter(member => !member.user.bot)
					.forEach(member => acc.add(member.id));

				return acc;
			},
			new Set()
		).size;

		let guilds = client.guilds.array().length;

		resolve({ members: members, guilds: guilds });
	});
};

exports.setGame = async (client) => {
	let { members, guilds } = await this.getGuildsAndMembers(client);

	// {
	//   config data...
	//   "statusApi": {
	//     "sites": [
	//       {
	//         "url": "bots.discord.pw",
	//         "token": "foo"
	//       }
	//     ], ...
	//   }
	// }
	// Follows the API documentation available @ https://bots.discord.pw/api and https://discordbots.org/api/docs#bots
	// (Due to shoddy documentation, this may not be 100% compliant, but it's good enough until I actually start sharding)
	if (client.config.statusApi) {
		await Promise.all(client.config.statusApi.sites.map(async (site) => {
			return new Promise((resolve, reject) => {
				let requestData = {
					server_count: guilds
				};

				// Sharding support
				// I don't use this (yet), but it's good in case this bot gets big enough for it to matter
				// (or for people who want this code for themselves)
				if (client.shard) {
					requestData.shard_id = client.shard.id;
					requestData.shard_count = client.shard.count;
				}

				request.post(
					{
						uri: `${site.url}/bots/${client.user.id}/stats`,
						headers: {
							Authorization: site.token
						},
						json: requestData
					},
					(err, res) => {
						if (err) return reject(err);

						const status = res.statusCode;
						if (![200, 204, 301].includes(status)) return reject(new Error(`Received unexpected status code: ${status} at URL ${site.url}`));

						return resolve();
					}
				);
			});
		}));
	}

	return client.user.setPresence({
		game: {
			name:`for ${client.commandPrefix || client.options.commandPrefix}help | ${members.toLocaleString()} members across ${guilds.toLocaleString()} guilds`,
			type: 'WATCHING'
		}
	});
};
