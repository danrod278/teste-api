const { buscaDetalhesImovel } = require('../crawler/caixa/getImoveisCaixa');

const { salvaCodigosCidades, salvarImoveisCidade, salvarImoveisEstado, salvarTodosImoveis } = require('../services/buscaImoveisCaixa');

const imovelRepository = require('../repositories/imovelRepository');
const cidadeRepository = require('../repositories/cidadeRepository');

exports.getImovelcaixa = async (req, res, next) => {
    // const { code } = req.params;
    const { code, uf, cidade } = req.query;
    let imovel = { leilao: '655750f7124d7a12826ca2b6', uf, cidade};
    console.log(imovel)
    console.log(code);
    buscaDetalhesImovel(code)
        .then(async (data) => {
            // Espalha as propriedades de 'data' no objeto 'imovel'
            imovel = { ...imovel, ...data };

            // Aqui você pode salvar 'imovel' no banco de dados ou fazer outras operações necessárias
            const savedImovel = await imovelRepository.newImovel(imovel);

            res.status(200).send(savedImovel);
        })
        .catch((error) => {
            res.status(500).send({Erro: error});
        });
};


exports.salvarImovel = async (req, res, next) => {
    const { code } = req.params;
    console.log(code);
    buscaDetalhesImovel(code)
        .then(async (data) => {
            const imovel = await imovelRepository.newImovel(data);
            res.status(200).send(imovel);
        })
        .catch((error) => {
            res.status(500).send({Erro: error});
        });
}

/*
*   Inicia o processo de busca de imóveis
*   Implantar tabela de processamnto com código, status e data de início e fim
*/
exports.runGetCidades = (req, res, next) => {
    salvaCodigosCidades();
    res.status(200).send({Message: 'Processo iniciado!'});
}

exports.getAllCidades = async (req, res, next) => {
    cidadeRepository.getAllCidades().then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(500).send({Erro: error.message});
    });
}

exports.obterTodosImoveisPorCidade = (req, res, next) => {
    const { cidade } = req.params;
    salvarImoveisCidade(cidade)
    res.status(200).send({Message: 'Processo iniciado!'});
}

exports.obterTodosImoveisPorEstado = (req, res, next) => {
    const { uf } = req.params;
    salvarImoveisEstado(uf)
    res.status(200).send({Message: 'Processo iniciado!'});
}

exports.obterTodosImoveis = async (req, res, next) => {
    salvarTodosImoveis();
    res.status(200).send({Message: 'Processo iniciado!'});
}

//criar controler para filtar imoveis por cidade, estado, leilao, etc
exports.getImoveisWithFilters = async (req, res, next) => {
    const { uf, cidade } = req.query;
    const imoveis = await imovelRepository.returnData({uf, cidade});
    res.status(200).send(imoveis);
}