require('dotenv').config();

const version = require("./package.json").version;

if (process.env.SCP_REDDIT_ID) {
	require("./services/reddit.js")({
		clientId: process.env.SCP_REDDIT_ID,
		clientSecret: process.env.SCP_REDDIT_SECRET,
		username: process.env.SCP_REDDIT_USERNAME,
		password: process.env.SCP_REDDIT_PASSWORD,
		userAgent: `ShortcutsPreview v${version}`,
	});
}

if (process.env.SCP_DISCORD_TOKEN) {
	require("./services/discord.js")(process.env.SCP_DISCORD_TOKEN);
}