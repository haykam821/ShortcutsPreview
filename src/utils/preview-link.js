/**
 * Gets a link to preview a shortcut.
 * @param {string} shortcutID The ID of the shortcut to link to.
 * @returns {string} The preview link.
 */
function getPreviewLink(shortcutID) {
	return "https://showcuts.app/share/view/" + encodeURIComponent(shortcutID);
}
module.exports = getPreviewLink;
