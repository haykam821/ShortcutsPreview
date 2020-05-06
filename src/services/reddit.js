const snoowrap = require("snoowrap");
const snoostorm = require("snoostorm");

const utils = require("shortcuts.js");
const getShortcutDetails = require("../logging-gsd.js");

const semver = require("semver");
const escape = require("markdown-escape");

const { homepage } = require("../../package.json");

const Service = require("../types/service.js");
const getPreviewLink = require("../utils/preview-link.js");

/**
 * Formats a response with a shortcut preview.
 * @param {Shortcut} shortcut The shortcut.
 * @param {ShortcutMetadata} metadata The shortcut metadata.
 * @param {string} betaRange The beta range.
 * @param {string} testSubreddit The test subreddit to link to.
 * @param {string} version The version of ShortcutsPreview.
 * @returns {string} The formatted response.
 */
function format(shortcut, metadata, betaRange, testSubreddit, version) {
	const msg = [];

	// Name of shortcut
	msg.push(`#### Shortcut: ${escape(shortcut.name)}`);

	if (shortcut.longDescription) {
		msg.push(">" + escape(shortcut.longDescription));
	}

	// Links to shortcut download and preview
	msg.push(`* ⬇️ [Download](${escape(shortcut.getLink())})`);
	msg.push(`* 🔎 [Preview](${getPreviewLink(shortcut.id)})`);

	const coerced = semver.coerce(metadata.client.release);
	if (semver.satisfies(coerced, betaRange)) {
		msg.push("* 🐞 Shortcuts Beta v" + coerced);
	}

	// Footer with meta info
	const testSubLink = testSubreddit ? ` • [Test me!](https://www.reddit.com/r/${testSubreddit})` : "";

	msg.push("---");
	msg.push(`ShortcutsPreview v${version}${testSubLink} • [Creator](https://www.reddit.com/user/haykam821) • [Source code](${homepage})`);

	return msg.join("\n\n");
}

class RedditService extends Service {
	start() {
		const client = new snoostorm(new snoowrap(Object.assign(this.config.credentials, {
			userAgent: "ShortcutsPreview v" + this.version,
		})));

		const sub = Array.isArray(this.config.subreddits) ? this.config.subreddits.join("+") : this.config.subreddits;
		const stream = client.SubmissionStream({
			subreddit: sub,
		});

		stream.on("submission", post => {
			if (!post.is_self) {
				const id = utils.idFromURL(post.url);
				if (id) {
					getShortcutDetails(this.log, id).then(async shortcut => {
						const metadata = await shortcut.getMetadata();

						post.reply(format(shortcut, metadata, this.config.betaRange, this.config.testSubreddit, this.version)).then(reply => {
							this.log("Sent a preview for the '%s' shortcut.", shortcut.name);
							reply.distinguish({
								status: true,
								sticky: true,
							}).then(() => {
								this.log("Pinned a preview for the '%s' shortcut.", shortcut.name);
							}).catch(() => {
								this.log("Couldn't pin a preview for the '%s' shortcut.", shortcut.name);
							});
						}).catch(() => {
							this.log("Couldn't send a preview for the '%s' shortcut.", shortcut.name);
						});
					});
				}
			}
		});
	}
}
module.exports = RedditService;
