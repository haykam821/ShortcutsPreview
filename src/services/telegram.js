const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const utils = require("shortcuts.js");
const getShortcutDetails = require("../logging-gsd.js");

const semver = require("semver");
const escape = require("markdown-escape");

const Service = require("../types/service.js");
const getPreviewLink = require("../utils/preview-link.js");

/**
 * Whether to hide a button.
 * @param {string} button The button that could be hidden.
 * @param {Object} config The service config.
 * @returns {boolean} Whether the button should be hidden.
 */
function hideButton(button, config) {
	if (!Array.isArray(config.buttons)) return true;
	return !config.buttons.includes(button);
}

class TelegramService extends Service {
	start() {
		const client = new Telegraf(this.config.token);

		if (this.config.command) {
			client.telegram.setMyCommands([{
				command: "preview",
				description: "Previews a shortcut.",
			}]);

			client.command("preview", ctx => {
				const id = ctx.message.text.split(" ").slice(1).join(" ");
				if (!id) {
					ctx.reply("A shortcut ID or link must be specified.");
					return;
				}

				if (!utils.idFromURL(id)) {
					ctx.reply("The provided shortcut ID or link is invalid.");
					return;
				}

				this.log("Recieved preview request from preview command");
				this.sendPreview(ctx, id);
			});
		}

		client.hears(message => {
			return message.split(" ").find(utils.idFromURL);
		}, ctx => {
			const id = utils.idFromURL(ctx.match);
			if (id) {
				this.log("Recieved preview request from general message");
				this.sendPreview(ctx, id);
			}
		});

		client.launch().then(() => {
			this.log("Connected to Telegram.");
		}).catch(() => {
			this.log("Couldn't connect to Telegram.");
		});
	}

	sendPreview(ctx, id) {
		getShortcutDetails(this.log, id).then(async shortcut => {
			const metadata = await shortcut.getMetadata();

			const description = [];

			const createdString = shortcut.creationDate ? " (created " + shortcut.creationDate.toLocaleString("en-US") + ")" : "";
			description.push("*Shortcut: " + shortcut.name + "*" + createdString);


			// Add italicized long description, if there is one
			if (shortcut.longDescription) {
				description.push("*" + escape(shortcut.longDescription) + "*");
			}

			// Create icons for description
			const icons = [];
			const coerced = semver.coerce(metadata.client.release);
			if (semver.satisfies(coerced, this.config.betaRange)) {
				icons.push("🐞 Shortcuts Beta v" + coerced);
			}
			icons.push(`💾 ShortcutsPreview v${this.version}`);
			description.push(icons.join("\n"));

			// Create buttons
			const downloadURL = shortcut.downloadURL.replace("${f}", encodeURIComponent(shortcut.name + ".shortcut"));
			const markup = Extra.markup(
				Markup.inlineKeyboard([
					Markup.urlButton("Add", shortcut.getLink(), hideButton("add", this.config)),
					Markup.urlButton("Download", downloadURL, hideButton("download", this.config)),
					Markup.urlButton("Preview", getPreviewLink(shortcut.id), hideButton("preview", this.config)),
				]),
			);

			// Send reply
			ctx.replyWithMarkdown(description.join("\n\n"), markup).then(() => {
				this.log("Sent a preview for the '%s' shortcut.", shortcut.name);
			}).catch(() => {
				this.log("Couldn't send a preview for the '%s' shortcut.", shortcut.name);
			});
		});
	}
}
module.exports = TelegramService;
