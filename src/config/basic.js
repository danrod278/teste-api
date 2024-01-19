const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const cron = require('node-cron');

function captureResponseBody(req, res, next) {

    const ignoredRoutes = ['/', '/file/log/view'];
    if (ignoredRoutes.includes(req.path)) {
        return next();
    }
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = function (chunk) {
        if (chunk && typeof chunk === 'string') {
            chunk = Buffer.from(chunk, 'utf8');
        }
        if (Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
        } else {
            console.error("Unexpected non-buffer chunk in res.write", chunk);
        }
        oldWrite.apply(res, arguments);
    };
    
    res.end = function (chunk) {
        if (chunk) {
            if (typeof chunk === 'string') {
                chunk = Buffer.from(chunk, 'utf8');
            }
            if (Buffer.isBuffer(chunk)) {
                chunks.push(chunk);
            } else {
                console.error("Unexpected non-buffer chunk in res.end", chunk);
            }
        }
        try {
            const body = Buffer.concat(chunks).toString('utf8');
            res.body = body;
            oldEnd.apply(res, arguments);
        } catch (e) {
            console.error('Error when concatenating chunks:', e, chunks);
        }
    }; 

    next();
}
app.use(captureResponseBody);


morgan.token('res-body', (req, res) => {
    if (!res.body) return '';

    let bodyStr = typeof res.body === 'string' ? res.body : JSON.stringify(res.body);

    // Removendo espaços em branco repetidos e quebras de linha
    bodyStr = bodyStr.replace(/\s+/g, ' ').trim();

    return bodyStr;
});


morgan.token('req-body', (req) => JSON.stringify(req.body));
morgan.token('req-headers', function (req) { return JSON.stringify(req.headers); });

// const morganFormat = ':method :url :status :res[content-length] - :response-time ms :req-body';
const morganFormat = ':date[iso] :method :url :status :res[content-length] - :response-time ms :req-headers requestBody: :req-body responseBody: :res-body';




const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' });

app.use(morgan(morganFormat, { stream: accessLogStream }));
// app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * CRON JOBS
 */
// Configura um cron job para ser executado a cada minuto
// cron.schedule('* * * * *', () => {
//     const city = require('../actions/city');
//     city.buscarCidades();
//     console.log('Cron job executado a cada minuto.');
// });

module.exports = app;