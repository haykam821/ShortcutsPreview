/**
 * A service.
 */
class Service {
	constructor(config, log, version) {
		/**
		 * The per-service configuration.
		 * @type {Object}
		 */
		this.config = config;

		/**
		 * A logger specific to the service.
		 * @type {debug.Debugger}
		 */
		this.log = log;

		/**
		 * The version of ShortcutsPreview.
		 * @type {string}
		 */
		this.version = version;
	}

	/**
	 * Starts the service.
	 * @abstract
	 */
	start() {
		return;
	}
}
module.exports = Service;
