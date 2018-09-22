require('dotenv').config();

const config = Object.assign(require("./config.json"), {
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
	const serviceConfig = Object.assign(config.global, config[name]);
	if (serviceConfig.enabled) {
		return require(`./services/${name}.js`)(serviceConfig);
	}
}

service("reddit");
service("discord");