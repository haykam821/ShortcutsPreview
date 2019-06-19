const djs = require("discord.js");

const utils = require("shortcuts.js");
const getShortcutDetails = require("../logging-gsd.js");

const escape = require("markdown-escape");

const { version } = require("./../package.json");

module.exports = config => {
	const client = new djs.Client();

	client.on("message", msg => {
		if (msg.author.id !== client.user.id) {
			const words = msg.content.split(" ");
			
			const url = words.find(utils.idFromURL);
			const id = utils.idFromURL(url);
			
			if (id) {
				getShortcutDetails(config.log, id).then(shortcut => {
					const embed = new djs.RichEmbed();
					
					embed.setTitle("Shortcut: " + shortcut.name);
					embed.setURL(shortcut.getLink());
					
					const description = [];
					
					// Add bolded long description, if there is one
					if (shortcut.longDescription) {
						description.push("**" + shortcut.longDescription + "**");
					}

					description.push(`\\🔎 [Preview](${escape("https://preview.scpl.dev/?shortcut=" + shortcut.id)})`);
					
					embed.setDescription(description.join("\n\n"));

					// Get a normal hex color from the icon color for the embed color
					const iconColor = shortcut.icon.color.toString(16).slice(0, 6);
					embed.setColor(iconColor);

					// Make the footer
					embed.setTimestamp(shortcut.creationDate);
					embed.setFooter(`ShortcutsPreview v${version}`);
					
					msg.channel.send("", embed).then(() => {
						config.log("Sent a preview for the '%s' shortcut.", shortcut.name);
					}).catch(() => {
						config.log("Couldn't send a preview for the '%s' shortcut.", shortcut.name);
					});
				});
			}
		}
	});

	client.login(config.token).then(() => {
		config.log("Connected to Discord.");
	}).catch(() => {
		config.log("Couldn't connect to Discord.");
	}); 
}
