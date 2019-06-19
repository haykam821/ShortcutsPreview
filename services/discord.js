const djs = require("discord.js");

const utils = require("shortcuts.js");

const { version } = require("./../package.json");

module.exports = config => {
	const client = new djs.Client();

	client.on("message", msg => {
		if (msg.author.id !== client.user.id) {
			const words = msg.content.split(" ");
			
			const url = words.find(utils.idFromURL);
			const id = utils.idFromURL(url);
			
			if (id) {
				utils.getShortcutDetails(id).then(shortcut => {
					const embed = new djs.RichEmbed();

					embed.attachFile({
						attachment: shortcut.icon.downloadURL,
						name: "icon.png",
					});
					embed.setAuthor("Shortcut: " + shortcut.name, "attachment://icon.png", shortcut.getLink());
					
					const description = [];
					
					// Add bolded long description, if there is one
					if (shortcut.longDescription) {
						description.push("**" + shortcut.longDescription + "**");
					}
					
					embed.setDescription(description.join("\n\n"));

					// Get a normal hex color from the icon color for the embed color
					const iconColor = shortcut.icon.color.toString(16).slice(0, 6);
					embed.setColor(iconColor);

					// Make the footer
					embed.setTimestamp(shortcut.creationDate);
					embed.setFooter(`ShortcutsPreview v${version}`);
					
					msg.channel.send("", embed);
				});
			}
		}
	});

	client.login(config.token);
}
