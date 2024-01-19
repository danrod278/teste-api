const tokenIntercept = require('../middlewares/tokenIntercept')

module.exports = (app) => {

    const excludeRoutes = ['/', '/register', '/user/login', '/user/setuserdefault']
    // TODO buscar rotas publicas do banco de dados
    // Lista de rotas publicas que não devem passar pela autenticação.

    if (process.env.NODE_ENV === 'development') {
        app.use((req, res, next) => {
            next();
        });
    } else {
        app.use(tokenIntercept(...excludeRoutes));
    }

}