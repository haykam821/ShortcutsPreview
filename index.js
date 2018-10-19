const debug = require("debug");
const config = debug("shortcutspreview:config");

if (require('dotenv').config()) {
	config("Using environment variables for configuration is deprecated. Please use config.json instead.");
}

try {
	var configJSON = require("./config.json");
} catch (error) {
	var configJSON = {};
	config("The configuration for ShortcutsPreview is missing.");
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
	},
	discord: {
		token: process.env.SCP_DISCORD_TOKEN,
	},
});

function service(name) {
	const serviceConfig = Object.assign(config.global, config[name], {
		// Expose a debugger specific to the service
		log: debug(`shortcutspreview:services:${name}`),
	});
	if (serviceConfig.enabled) {
		return require(`./services/${name}.js`)(serviceConfig);
	}
}

service("reddit");
service("discord");
