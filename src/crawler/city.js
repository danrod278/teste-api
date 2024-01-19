const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const mongoose = require('mongoose')

const { Cidade } = require('../models/cidadeModel');

const cidadeRepository = require('../repositories/cidadeRepository');

const estados = require('../enums/estados')

async function buscarCidades(UF) {
    try {
        const url = 'https://venda-imoveis.caixa.gov.br/sistema/carregaListaCidades.asp';

        // Dados do corpo da requisição
        const data = {
            cmb_estado: UF,
            cmb_tp_venda: '',
            cmb_tp_imovel: '',
            cmb_area_util: 'Selecione',
            cmb_faixa_vlr: 'Selecione',
            cmb_quartos: 'Selecione',
            cmb_vg_garagem: 'Selecione',
            strValorSimulador: '',
            strAceitaFGTS: '',
            strAceitaFinanciamento: ''
        };

        const response = await axios.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });

        // console.log(response.data);
        const $ = cheerio.load(response.data);
        $('option').each(async (i, element) => {
            const codigo = $(element).val();
            const nome = $(element).text().trim();

            if (codigo && nome && nome !== 'Selecione') {
                cidadeRepository.newCidade({ nome, UF: UF, codigo }); // Ajuste a UF conforme necessário
            }
        })
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
    }
}

async function buscarCidadesPorEstados() {
    for (let sigla in estados) {
        if (estados.hasOwnProperty(sigla)) {
            console.log('Buscando cidades do estado ' + sigla);
            await buscarCidades(sigla);
        }
    }
}

buscarCidadesPorEstados();