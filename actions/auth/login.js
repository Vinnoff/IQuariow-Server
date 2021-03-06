const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

module.exports = (api) => {
	const User = api.models.User;
	const Token = api.models.Token;

	return function login(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(401).send('no.credentials');
        } else {
            User.findOne({
                    username: req.body.username},
                (err, user) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    if (!user) {
                        return res.status(404).send('user.not.found');
                    }

                    if(user.password != sha1(req.body.password)){
                        return res.status(403).send('invalid.credentials');
                    }

                    createToken(user, res, next);
                });
		}

	};

	function createToken(user, res, next) {
		var token = new Token();
		token.userId = user.id.toString();
		token.save((err, token) => {
			if (err) {
				return res.status(500).send(err);
			}

			jwt.sign({
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000), //100 days
					tokenId: token.id.toString()
				},
				api.settings.security.salt, {}, (err, encryptedToken) => {
					if (err) {
						return res.status(500).send(err);
					}
					console.log(Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 100 * 1000));
					return res.send(encryptedToken);
				}
			);
		});
	}
};
