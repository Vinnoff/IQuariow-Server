module.exports = (api) => {
	api.middlewares = {
		logger: require('./logger'),
		bodyParser: require('body-parser'),
		cache: require('./cache')(api),
		ensureAuthentificated: require('./ensureAuthentificated')(api),
	};
};
