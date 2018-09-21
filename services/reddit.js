const snoowrap = require("snoowrap");
const snoostorm = require("snoostorm");

const utils = require("./../utils.js");

const escape = require("markdown-escape");

const { version, homepage } = require("./../package.json");

function format(shortcut) {
	return [
		`## Shortcut: ${escape(shortcut.name)}`,
		"",
		`Click [here](${escape(shortcut.link)}) to view and get this shortcut.`,
		"",
		"---",
		"",
		`ShortcutsPreview v${version} • [Creator](https://www.reddit.com/user/haykam821) • [Source code](${homepage})`,
	].join("\n");
}

module.exports = credentials => {
	const client = new snoostorm(new snoowrap(credentials));
	const stream = client.SubmissionStream({
		"subreddit": "mod",
	});

	stream.on("submission", post => {
		if (!post.is_self) {
			const id = utils.shortcutFromURL(post.url);
			if (id) {
				utils.getShortcutDetails(id).then(shortcut => {
					post.reply(format(shortcut)).then(reply => {
						reply.distinguish({
							status: true,
							sticky: true,
						});
					});
				});
			}
		}
	});
};
