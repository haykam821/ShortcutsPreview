const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const utils = require("shortcuts.js");
const getShortcutDetails = require("../logging-gsd.js");

const semver = require("semver");
const escape = require("markdown-escape");

const { version } = require("./../package.json");

module.exports = config => {
	const client = new Telegraf(config.token);

	client.hears(message => {
		return message.split(" ").find(utils.idFromURL);
	}, ctx => {
		const id = utils.idFromURL(ctx.match);

		if (id) {
			getShortcutDetails(config.log, id).then(async shortcut => {
				const metadata = await shortcut.getMetadata();

				const description = [];

				const createdString = shortcut.creationDate ? " (created " + shortcut.creationDate.toLocaleString("en-US") + ")": "";
				description.push("*Shortcut: " + shortcut.name + "*" + createdString);


				// Add italicized long description, if there is one
				if (shortcut.longDescription) {
					description.push("*" + escape(shortcut.longDescription) + "*");
				}

				// Create icons for description
				const icons = [];
				const coerced = semver.coerce(metadata.client.release)
				if (semver.satisfies(coerced, config.betaRange)) {
					icons.push("🐞 Shortcuts Beta v" + coerced);
				}
				icons.push(`💾 ShortcutsPreview v${version}`);
				description.push(icons.join("\n"));

				// Create buttons
				const downloadURL = shortcut.downloadURL.replace("${f}", encodeURIComponent(shortcut.name + ".shortcut"));
				const markup = Extra.markup(
					Markup.inlineKeyboard([
						Markup.urlButton("Add", shortcut.getLink()),
						Markup.urlButton("Download", downloadURL),
						Markup.urlButton("Preview", "https://preview.scpl.dev/?shortcut=" + shortcut.id),
					]),
				);

				// Send reply
				ctx.replyWithMarkdown(description.join("\n\n"), markup).then(() => {
					config.log("Sent a preview for the '%s' shortcut.", shortcut.name);
				}).catch(() => {
					config.log("Couldn't send a preview for the '%s' shortcut.", shortcut.name);
				});
			});
		}
	});
	
	client.launch().then(() => {
		config.log("Connected to Telegram.");
	}).catch(() => {
		config.log("Couldn't connect to Telegram.");
	});;
};