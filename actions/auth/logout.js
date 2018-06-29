module.exports = (api) => {
	const Token = api.models.Token;

	return function logout(req, res, next) {
		Token.findOneAndRemove({
			userId: req.userId,
		}, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (!data) {
				return res.status(404).send("token.not.found");
			}
			req.userId = null;

			return res.send(data);
		});
	};
};
