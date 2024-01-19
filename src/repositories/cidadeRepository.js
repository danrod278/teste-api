const { Cidade } = require('../models/cidadeModel');

exports.create = async (data) => {
    try {
        const cidade = new Cidade(data);
        await cidade.save();
        return cidade
    } catch (error) {
        return error
    }
}

exports.createMany = async (data) => {
    try {
        const cidades = await Cidade.insertMany(data);
        return cidades
    } catch (error) {
        return error
    }
}

exports.getAllCidades = async () => {
    try {
        const cidades = await Cidade.find();
        console.log(cidades);
        return cidades
    } catch (error) {
        return error
    }
}

exports.getCidadeByNome = async (nome) => {
    try {
        const cidade = await Cidade.findOne({ nome: nome });
        return cidade
    } catch (error) {
        return error
    }

}

exports.getCidadePorCodigo = async (codigo) => {
    try {
        const cidade = await Cidade.findOne({ codigo: codigo });
        return cidade
    } catch (error) {
        return error
    }
}

exports.getCidadesByUF = async (UF) => {
    try {
        const cidades = await Cidade.find({ UF: UF });
        return cidades
    } catch (error) {
        return error
    }
}

/**
 * regras de movimentação no bando (CRUD)
*/