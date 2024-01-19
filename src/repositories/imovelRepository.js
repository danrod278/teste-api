const { Imovel } = require('../models/imovelModel')
const { ImovelErro } = require('../models/erroCadastroModel')
const { calculatePagination, buildQueryConditions } = require('../utils/imovelUtils')

exports.newImovel = async (body) => {
    const filter = { codigo: body.codigo }; // Substitua 'codigo' pelo campo identificador do imóvel
    const update = body;

    // As opções new: true e upsert: true garantem que o documento atualizado (ou criado, se não existir) seja retornado
    const imovel = await Imovel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    });

    return imovel;
};

exports.getImoveis = async (data) => {

    const conditions = buildQueryConditions(data)
    const totalRegistros = await Imovel.countDocuments(conditions);
    const { paginaAtual, max, totalPaginas } = calculatePagination(data, totalRegistros)

    const imoveis = totalRegistros > 0
        ? await Imovel.find(conditions).skip((paginaAtual - 1) * max).limit(max)
        : [];

    return {
        totalRegistros,
        totalPaginas,
        paginaAtual,
        imoveis
    };
};




exports.getImovelById = async (id) => {
    const imovel = await Imovel.findById(id);
    return imovel;
};

exports.returnData = async (data) => {
    const { uf, cidade } = data;
    const imoveis = await Imovel.find({ uf, cidade });
    return imoveis;
}

exports.newImovelErro = async (body) => {
    const filter = { codigo: body.codigo }; 
    const update = body;

    // As opções new: true e upsert: true garantem que o documento atualizado (ou criado, se não existir) seja retornado
    const imovelErro = await ImovelErro.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    });

    return imovelErro;
}


exports.getCodigosImoveisComErro = async (data) => {
    try {

        const { start, end } = data;

        // Ajustando para o início e o final do dia
        const startOfDay = new Date(start);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);

        // Buscando registros no intervalo do dia
        const imoveisComErro = await ImovelErro.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).select('codigo -_id'); // Selecionando apenas o campo 'codigo' e excluindo '_id'

        // Retornando apenas os códigos
        return imoveisComErro.map(imovel => imovel.codigo);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


exports.atualizarStatusImoveis = async (codigosExclusao) => {
    try {
        // Definindo o início do dia atual
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        // Atualizando os imóveis
        const result = await Imovel.updateMany(
            {
                codigo: { $nin: codigosExclusao },
                updatedAt: { $lt: hoje },// Verifica se 'updatedAt' é anterior ao início do dia atual
                ativo: true
            },
            {
                $set: { ativo: false }
            }
        );

        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
};
