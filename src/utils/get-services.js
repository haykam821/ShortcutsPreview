const requireAll = require("require-all");
const path = require("path");

/**
 * Gets all services.
 * @returns {Object<string, Service>} An object mapping service IDs to services.
 */
function getServices() {
	const services = requireAll({
		dirname: path.resolve(__dirname, "../services"),
		filter: /(.+)\.js$/,
	});
	return services;
}
module.exports = getServices;
