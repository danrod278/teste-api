const imovelRepository = require('../repositories/imovelRepository');

exports.listarImoveis = async (req, res) => {
    try {
        const imoveis = await imovelRepository.getImoveis(req.body);

        console.log(imoveis);
        res.status(200).send(imoveis);
    } catch (error) {
        console.error(error);
        res.status(500).send({ Erro: error.message });
    }
};



exports.cadastrarImovel = async (req, res) => {

    try {
        const imovel = await imovelRepository.newImovel(req.body);
        res.status(201).send(imovel);
    } catch (error) {
        res.status(500).send({Erro: error.message});
    }

}

exports.obterImovelPeloId = async (req, res) => {
    const { id } = req.params;
    try {
        const imovel = await imovelRepository.getImovelById(id);
        res.status(200).send(imovel);
    } catch (error) {
        res.status(500).send({Erro: error.message});
    }
}

exports.atualizarStatusImoveis = async (req, res) => { 
    try {
        const codigosExclusao = await imovelRepository.getCodigosImoveisComErro(req.body);
        const imoveis = await imovelRepository.atualizarStatusImoveis(codigosExclusao);
        res.status(200).send(imoveis);
    } catch (error) {
        res.status(500).send({Erro: error.message});
    }
}