const snoowrap = require("snoowrap");
const snoostorm = require("snoostorm");

const { URL } = require("url");
const queryString = require("querystring");

const got = require("got");
const baseURL = "https://www.icloud.com/shortcuts/api/records/";

const escape = require("markdown-escape");

const { version, homepage } = require("./../package.json");

function format(name, install) {
	return [
		`## Shortcut: [${escape(name)}](${escape(install)})`,
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
			const url = new URL(post.url);
			const path = url.pathname.split("/").splice(1);

			if (url.host === "www.icloud.com" && path[0] === "shortcuts") {
				got(baseURL + path[1], {
					json: true,
				}).then(response => {
					const name = response.body.fields.name.value;
					const install = `workflow://import-workflow/?name=${name}&url=${encodeURIComponent(encodeURI(response.body.fields.shortcut.value.downloadURL))}`;

					post.reply(format(name, install)).then(reply => {
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