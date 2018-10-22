try {
	var configJSON = require("./config.json");
} catch (error) {
	var configJSON = {};
	process.stderr.write("The configuration for ShortcutsPreview is missing.\n");
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
	},
	discord: {
		token: "",
		previewShortcutIcon: true,
	},
}, configJSON);

function service(name) {
	const serviceConfig = Object.assign(config.global, config[name]);
	if (serviceConfig.enabled) {
		return require(`./services/${name}.js`)(serviceConfig);
	}
}

service("reddit");
service("discord");