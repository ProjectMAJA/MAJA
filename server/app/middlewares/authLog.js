const jwt = require('jsonwebtoken');

/* Récupération du header bearer */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

/* Vérification du token */
const authLog = (req, res, next) => {
    // Récupération du token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Error. Need a token' })
    }

    // Véracité du token
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'Error. Bad token' })
        } else {
            req.userLogged = decodedToken;
            return next()
        }
    })
}

module.exports = authLog;