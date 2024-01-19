const axios = require('axios');
const qs = require('qs'); // qs é usado para formatar o corpo da requisição

const caixa = require('../enums/caixaRotas');

async function buscarImoveis() {
    try {
        const url = 'https://venda-imoveis.caixa.gov.br/sistema/' + caixa.CAIXA_ROTA_PESQUISA_IMOVEIS;

        // Corpo da requisição
        const data = {
            hdn_estado: 'SP',
            hdn_cidade: '9859',
            hdn_bairro: '',
            hdn_tp_venda: '34',
            hdn_tp_imovel: 'Selecione',
            hdn_area_util: 'Selecione',
            hdn_faixa_vlr: 'Selecione',
            hdn_quartos: 'Selecione',
            hdn_vg_garagem: 'Selecione',
            strValorSimulador: '',
            strAceitaFGTS: '',
            strAceitaFinanciamento: ''
        };

        const response = await axios.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }
}

buscarImoveis();
