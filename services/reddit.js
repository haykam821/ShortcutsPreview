const snoowrap = require("snoowrap");
const snoostorm = require("snoostorm");

const utils = require("shortcuts.js");
const getShortcutDetails = require("./../logging-gsd.js");

const escape = require("markdown-escape");

const { version, homepage } = require("./../package.json");

function format(shortcut) {
	const msg = [];
	
	// Name of shortcut
	msg.push(`#### Shortcut: ${escape(shortcut.name)}`);
	
	if (shortcut.longDescription) {
		msg.push(">" + escape(shortcut.longDescription));
	}
	
	// Links to shortcut download and preview
	msg.push(`⬇️ [Download](${escape(shortcut.getLink())})`);
	msg.push(`🔎 [Preview](${escape("https://preview.scpl.dev/?shortcut=" + shortcut.id)})`);
	
	// Footer with meta info
	msg.push("---");
	msg.push(`ShortcutsPreview v${version} • [Test me!](https://www.reddit.com/r/ShortcutsPreview) • [Creator](https://www.reddit.com/user/haykam821) • [Source code](${homepage})`);
	
	return msg.join("\n\n");
}

module.exports = config => {
	const client = new snoostorm(new snoowrap(Object.assign(config.credentials, {
		userAgent: "ShortcutsPreview v" + version,
	})));

	const sub = Array.isArray(config.subreddits) ? config.subreddits.join("+") : config.subreddits;
	const stream = client.SubmissionStream({
		"subreddit": sub,
	});

	stream.on("submission", post => {
		if (!post.is_self) {
			const id = utils.idFromURL(post.url);
			if (id) {
				getShortcutDetails(config.log, id).then(shortcut => {
					post.reply(format(shortcut)).then(reply => {
						config.log("Sent a preview for the '%s' shortcut.", shortcut.name);
						reply.distinguish({
							status: true,
							sticky: true,
						}).then(() => {
							config.log("Pinned a preview for the '%s' shortcut.", shortcut.name);
						}).catch(() => {
							config.log("Couldn't pin a preview for the '%s' shortcut.", shortcut.name);
						});
					}).catch(() => {
						config.log("Couldn't send a preview for the '%s' shortcut.", shortcut.name);
					});
				});
			}
		}
	});
};
