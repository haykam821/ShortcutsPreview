const debug = require("debug");
const configLog = debug("shortcutspreview:config");

if (require('dotenv').config()) {
	configLog("Using environment variables for configuration is deprecated. Please use config.json instead.");
}

const loadErrors = {
	MODULE_NOT_FOUND: "The configuration for ShortcutsPreview is missing.",
	generic: "The configuration could not be loaded.",
};

try {
	var configJSON = require("./config.json");
} catch (error) {
	var configJSON = {};
	configLog(loadErrors[error.code] || loadErrors.generic);
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
