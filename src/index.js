const merge = require("merge-deep");

const debug = require("debug");
const configLog = debug("shortcutspreview:config");

const loadErrors = {
	MODULE_NOT_FOUND: "The configuration for ShortcutsPreview is missing.",
	generic: "The configuration could not be loaded.",
};

try {
	var configJSON = require("../config.json");
} catch (error) {
	var configJSON = {};
	configLog(loadErrors[error.code] || loadErrors.generic);
}

const { version } = require("../package.json");

const config = merge({
	global: {
		enabled: true,
		betaRange: ">=3.0.0",
	},
	reddit: {
		credentials: {
			clientId: "",
			clientSecret: "",
			username: "",
			password: "",
		},
		subreddits: "all",
		testSubreddit: "ShortcutsPreview",
	},
	discord: {
		token: "",
		previewShortcutIcon: true,
	},
	telegram: {
		buttons: [
			"add",
			"download",
			"preview",
		],
		token: "",
	}
}, configJSON);

const services = require("./utils/get-services.js")();
Object.entries(services).forEach(([ name, service ]) => {
	// Expose a debugger specific to the service
	const log = debug(`shortcutspreview:services:${name}`);

	const serviceConfig = merge(config.global, config[name], {
		log,
	});
	if (serviceConfig.enabled) {
		const serviceInstance = new service(serviceConfig, log, version);
		serviceInstance.start();
	}
});
