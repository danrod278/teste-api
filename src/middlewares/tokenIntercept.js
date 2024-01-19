const jwt = require('jsonwebtoken');
const routeByPass = require('../helpers/routeByPass')

const SECRET_KEY = global.SALT_KEY; 

const tokenIntercept = async (req, res, next) => {
    // Recupera o token do cabeçalho "Authorization".
    const bearerHeader = req.headers['authorization'];
    
    let token;
    if (bearerHeader && bearerHeader.startsWith('Bearer ')) {
        // Separa o "Bearer" do token.
        token = bearerHeader.split(' ')[1];
    }

    // Se o token não existir, retorne um erro.
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // Se o token existir, verifique-o.
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        // Se tudo estiver ok, salve o payload do token no objeto de request para uso posterior.
        req.userId = decoded.id;
        req.userRole = decoded.role
        req.userEmail = decoded.email
        req.userName = decoded.name
        req.userStatus = decoded.status
        next();
    });
};

module.exports = (...excludeRoutes) => routeByPass(tokenIntercept, ...excludeRoutes);