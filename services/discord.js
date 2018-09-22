const djs = require("discord.js");

const utils = require("./../utils.js");

const { version } = require("./../package.json");

module.exports = token => {
	const client = new djs.Client();

	client.on("message", msg => {
		if (msg.author.id !== client.user.id) {
			const words = msg.content.split(" ");
			
			const url = words.find(utils.shortcutFromURL);
			const id = utils.shortcutFromURL(url);
			
			if (id) {
				utils.getShortcutDetails(id).then(shortcut => {
					const embed = new djs.RichEmbed();
					
					embed.setTitle("Shortcut: " + shortcut.name);
					embed.setURL(shortcut.link);

					// Make the footer
					embed.setTimestamp(shortcut.creationDate);
					embed.setFooter(`ShortcutsPreview v${version}`)
					
					msg.channel.send("", embed);
				});
			}
		}
	});

	client.login(token);
}
