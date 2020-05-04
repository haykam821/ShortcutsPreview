const { getShortcutDetails } = require("shortcuts.js"); 

/**
	* Fetches a shortcut while also logging its status.
	* @param logger The logger to log to.
**/
module.exports = (logger, ...args) => {
	return getShortcutDetails(...args).then(shortcut => {
		logger("Fetched the '%s' shortcut.", shortcut.name);
		return shortcut;
	}).catch(error => {
		logger("Failed to fetch a shortcut with ID '%s'.", arguments[0]);
		throw error;
	});
};
