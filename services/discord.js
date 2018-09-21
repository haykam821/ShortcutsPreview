const djs = require("discord.js");

const utils = require("./../utils.js");

module.exports = token => {
	const client = new djs.Client();

	client.on("message", msg => {
		const words = msg.split(" ");
		
		const url = words.find(utils.shortcutFromURL);
		const id = utils.shortcutFromURL(url);
		
		if (id) {
			utils.getShortcutDetails(id).then(shortcut => {
				msg.channel.send("", {
					embed: {
						title: "Shortcut: " + shortcut.name,
					},
				});
			});
		}
	});

	client.login(token);
}
