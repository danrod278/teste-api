const index = require('../routes');
const leilao = require('../routes/leilaoRoute');
const imovel = require('../routes/imovelRoute');
const caixa = require('../routes/caixaRoutes');
const user = require('../routes/user.routes');
const cidade = require('../routes/cidade.routes');

module.exports = (app) => {
    app.use('/api', index);
    app.use('/api/leilao', leilao);
    app.use('/api/imovel', imovel);
    app.use('/api/caixa', caixa);
    app.use('/api/user', user);
    app.use('/api/cidade', cidade);
}