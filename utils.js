const { URL } = require("url");

const got = require("got");
const baseURL = "https://www.icloud.com/shortcuts/api/records/";
const baseLink = "https://www.icloud.com/shortcuts/";

function shortcutFromURL(url = "https://example.org") {
	const parsedUrl = new URL(url);
	const path = parsedUrl.pathname.split("/").splice(1);
	
	if (parsedUrl.host === "www.icloud.com" && path[0] === "shortcuts") {
		return path[1];
	} else {
		return false;
	}
}

function getShortcutDetails(id) {
	return new Promise((resolve, reject) => {
		got(baseURL + id, {
			json: true,
		}).then(response => {
			resolve({
				name: response.body.fields.name.value,
				link: baseLink + response.body.id,
			});
		}).catch(reject);
	});
}

module.exports = {
	shortcutFromURL,
	getShortcutDetails,
};
