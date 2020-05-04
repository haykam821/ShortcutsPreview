const { getShortcutDetails } = require("shortcuts.js");

/**
 * Fetches a shortcut while also logging its status.
 * @param {debug.Debugger} logger The logger to log to.
 * @param {...*} args The arguments to pass to getShortcutDetails.
 * @returns {Promise<Shortcut>} The shortcut.
 */
function loggingGSD(logger, ...args) {
	return getShortcutDetails(...args).then(shortcut => {
		logger("Fetched the '%s' shortcut.", shortcut.name);
		return shortcut;
	}).catch(error => {
		logger("Failed to fetch a shortcut with ID '%s'.", args[0]);
		throw error;
	});
}
module.exports = loggingGSD;