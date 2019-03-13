if (require('dotenv').config()) {
	process.stderr.write("Using environment variables for configuration is deprecated. Please use config.json instead.\n");
}

try {
	var configJSON = require("./config.json");
} catch (error) {
	var configJSON = {};
	process.stderr.write("The configuration for ShortcutsPreview is missing.\n");
}

const config = Object.assign(configJSON, {
	global: {
		enabled: true,
	},
	reddit: {
		credentials: {
			clientId: process.env.SCP_REDDIT_ID,
			clientSecret: process.env.SCP_REDDIT_SECRET,
			username: process.env.SCP_REDDIT_USERNAME,
			password: process.env.SCP_REDDIT_PASSWORD,
		},
		subreddits: "all",
	},
	discord: {
		token: process.env.SCP_DISCORD_TOKEN,
		showModificationDate: false,
	},
});

function service(name) {
	const serviceConfig = Object.assign(config.global, config[name]);
	if (serviceConfig.enabled) {
		return require(`./services/${name}.js`)(serviceConfig);
	}
}

service("reddit");
service("discord");
