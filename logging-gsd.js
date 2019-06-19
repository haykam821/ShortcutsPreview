const { getShortcutDetails } = require("shortcuts.js"); 

/**
	* Fetches a shortcut while also logging its status.
	* @param logger The logger to log to.
**/
module.exports = (logger, ...arguments) => {
	return getShortcutDetails(...arguments).then(shortcut => {
		logger("Fetched the '%s' shortcut.", shortcut.name);
	}).catch(() => {
		logger("Failed to fetch a shortcut with ID '%s'.", arguments[0]);
	});
};
