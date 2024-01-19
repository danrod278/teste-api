const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

module.exports = (app) => {
    app.use(cors(corsOptions));
}