const debug = require("debug");
const configLog = debug("shortcutspreview:config");

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

const config = Object.assign({
	global: {
		enabled: true,
	},
	reddit: {
		credentials: {
			clientId: "",
			clientSecret: "",
			username: "",
			password: "",
		},
		subreddits: "all",
	},
	discord: {
		token: "",
		previewShortcutIcon: true,
	},
}, configJSON);

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
