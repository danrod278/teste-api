// importar o axios
// importar o cheerio
const axios = require('axios');
const cheerio = require('cheerio');
const { METHODS } = require('http');
const { url } = require('inspector');
const qs = require('qs')
const { getFormattedDate } = require('../../helpers/date.helper');
// const { val } = require('cheerio/lib/api/attributes');


// busca lista de cidades por estados
const buscarCidadesPorEstados = async (UF) => {
    try {
        const response = await axios.post(
            'https://venda-imoveis.caixa.gov.br/sistema/carregaListaCidades.asp',
            qs.stringify({
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
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        );

        const $ = cheerio.load(response.data);
        let data = [];
        $('option').each((i, element) => {
            const codigo = $(element).val();
            const nome = $(element).text().trim();

            if (codigo && nome && nome !== 'Selecione') {
                data.push({ nome, UF: UF, codigo });
            }
        });
        return data;
    } catch (error) {
        console.error(`${getFormattedDate()} - Erro ao buscar cidades: `, error);
        throw error; // Lança o erro para ser capturado por quem chama a função
    }
}

// busca lista de imoveis por cidade
/**
 * 
 * @param {curl --location 'https://venda-imoveis.caixa.gov.br/sistema/carregaPesquisaImoveis.asp' \
--header 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
--header 'Cookie: ARRAffinity01=018dd6c2b49eeef40e522f4007ea6b3089ef253a85bdf5abd3f2d974a4f13207; ARRAffinity02=cc54d8e857ee8bf848ede87820711ad7de51e7472e884c2776e03108272a03ad; ASPSESSIONIDAQQTDSQA=LFKBJAHCKMPLPMMKNFIGJDIH; ASPSESSIONIDCCSBBABA=AHMNGLFCBLFFDEOPKOJGCMKI; UqZBpD3n3kS4aGYulCWJiSbNcs42xA__=v1LfZXgw__8oc; __uzma=6c72aacb-ea9d-4b80-b7bb-6f31032e4bf8; __uzmb=1700104458; __uzmc=676304617981; __uzmd=1700107556; __uzme=9579' \
--data 'hdn_estado=SP&hdn_cidade=9090&hdn_bairro=&hdn_tp_venda=&hdn_tp_imovel=Selecione&hdn_area_util=Selecione&hdn_faixa_vlr=Selecione&hdn_quartos=Selecione&hdn_vg_garagem=Selecione&trValorSimulador=&strAceitaFGTS=&strAceitaFinanciamento='} cidade_cod 
Response: <input type='hidden' name='hdnImov1' id='hdnImov1' value='08787703125021||08787707461085||08787708576633||00000010163268||08555535948665||08555538515050||0855<input type='hidden' name='hdnImov2' id='hdnImov2' value='08787706107105||08555<input type='hidden' name='hdnFiltro' id='hdnFiltro' value='SP||9090||||||4||0,<input type='hidden' name='hdnQtdPag' id='hdnQtdPag' value='2'><input type='hidden' name='hdnPagNum' id='hdnPagNum' value='1'><input type='hidden' name='hdnQtdRegistros' id='hdnQtdRegistros' value='13'><span class='legend-desc lighter milli'>Foram encontrados 13 imóveis.</span>
 */
const buscaListaImoveisPorCidade = async (UF, cidade_cod) => {
    try {
        const response = await axios.post(
            'https://venda-imoveis.caixa.gov.br/sistema/carregaPesquisaImoveis.asp',
            qs.stringify({
                hdn_estado: UF,
                hdn_cidade: cidade_cod,
                hdn_bairro: '',
                hdn_tp_venda: '',
                hdn_tp_imovel: 'Selecione',
                hdn_area_util: 'Selecione',
                hdn_faixa_vlr: 'Selecione',
                hdn_quartos: 'Selecione',
                hdn_vg_garagem: 'Selecione',
                strValorSimulador: '',
                strAceitaFGTS: '',
                strAceitaFinanciamento: ''
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        );

        const $ = cheerio.load(response.data);
        let codigosImoveis = [];

        $('input[name^="hdnImov"]').each((i, element) => {
            const codigos = $(element).val().split('||');
            codigosImoveis = codigosImoveis.concat(codigos);
        });

        // Removendo possíveis duplicatas e filtrando valores vazios
        codigosImoveis = [...new Set(codigosImoveis)].filter(codigo => codigo);

        const totalRegistros = $('input[name="hdnQtdRegistros"]').val();
        const totalPaginas = $('input[name="hdnQtdPag"]').val();

        const data = {
            paginas: totalPaginas,
            total_registros: totalRegistros,
            imoveis: codigosImoveis
        };



        return data;

    } catch (error) {
        console.error(`${getFormattedDate()} - Erro ao buscar lista de imóveis para: ${UF} - ${cidade_cod} `, error);
        throw error; // Lança o erro para ser capturado por quem chama a função
    }
}

/**
 * 
 * @param {*} UF 
 * @param {*} cidade_cod 
 * @param {*} pagina 
 * curl --location 'https://venda-imoveis.caixa.gov.br/sistema/carregaListaImoveis.asp' \
--header 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
--data 'hdnImov=08787703125021||08787707461085||08787708576633||08555535948665||08555538515050||08555538823480||08555538880735||08787704846431||08787706142300||08787706107105'
 */
// busca lista de imoveis por paginação
const buscaListaImoveisPorPaginacao = async (codigos) => {
    try {
        const response = await axios.post(
            'https://venda-imoveis.caixa.gov.br/sistema/carregaListaImoveis.asp',
            qs.stringify({
                hdnImov: codigos.join('||')
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        );

        const $ = cheerio.load(response.data);
        let data = [];


        $("[class='group-block-item;']").each((i, element) => {
            /**
             * Topos possiveis
             * 1º Leilão SFI
             * 2º Leilão SFI
             * Concorrência Pública
             * Leilão SFI - Edital Único
             * Licitação Aberta
             * Venda Direta FAR
             * Venda Direta Online
             * Venda Online
             */
            let tipoLicitacaoExtraido = $(element).find('span > strong > font').text().trim();
            const dataSessao = $(element).find('span > font').first().text().trim();
            const imagens = $(element).find('.fotoimovel-col1 img').map((i, el) => $(el).attr('src')).get();
            const endereco = $(element).find('.dadosimovel-col2 strong font').text().trim();
            const valorAvaliacao = $(element).find('.dadosimovel-col2 font').eq(2).text().trim();
            const valorMinimo = $(element).find('.dadosimovel-col2 b font').text().trim();
            const descricao = $(element).find('.dadosimovel-col2 span').last().text().trim();
            const codigoImovel = $(element).find('.dadosimovel-col2').text().match(/Número do imóvel: (\d+)/)?.[1];
            const linkEdital = $(element).find('.dadosimovel-col2 a').attr('onclick').match(/'([^']+)'/)?.[1]; // Supondo que o link esteja no atributo onclick

            let tipoLicitacao = '';

            const tiposPossiveis = [
                "1º Leilão SFI",
                "2º Leilão SFI",
                "Concorrência Pública",
                "Leilão SFI - Edital Único",
                "Licitação Aberta",
                "Venda Direta FAR",
                "Venda Direta Online",
                "Venda Online"
            ];

            // Verifica qual tipo de licitação corresponde ao texto extraído
            tiposPossiveis.forEach(tipo => {
                if (tipoLicitacaoExtraido.includes(tipo)) {
                    tipoLicitacao = tipo;
                }
            });

            data.push({
                tipoLicitacao,
                dataSessao,
                imagens,
                endereco,
                valorAvaliacao,
                valorMinimo,
                descricao,
                codigoImovel,
                linkEdital
            });
        });


    } catch (error) {
        console.error(`${getFormattedDate()} - Erro ao buscar imóveis por paginação: `, error);
        throw error; // Lança o erro para ser capturado por quem chama a função
    }
}

// busca detalhes do imovel
/**
 * 
 * @param {*} imovel_cod 
 * 
 * 
curl --location 'https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: ARRAffinity02=247fcabb6813a9f5eb4d7cfdc27ce23da9932e836f0a4a4de5afc1d98864267d; ASPSESSIONIDCAARTASA=MLIMNABAKAFHMBOINAFPNJGL; UqZBpD3n3kS4aGYulCWJiSbNcs42xA__=v1LPZXgw__ksf; __uzma=8cf2fa4f-089d-4c5b-b154-f2d36ee432c0; __uzmb=1699232846; __uzmc=685502298108; __uzmd=1699232908; __uzme=4303' \
--data-urlencode 'hdnimovel=8555537712588'
 */
const buscaDetalhesImovel = async (imovel_cod) => {
    try {
        const response = await axios({
            METHODS: 'POST',
            url: 'https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp',

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:
                qs.stringify({
                    'hdnimovel': imovel_cod
                })
        });


        // const imovel = require('./getImovel.mock.js');
        const $ = cheerio.load(response.data);
        // const $ = cheerio.load(imovel); 
        // const opcoesFinanciamento = {
        //     fgts: null,
        //     financiamento: null,
        //     parcelamento: null,
        //     consorcio: null
        // };

        const tiposPossiveis = [
            "1º Leilão SFI",
            "2º Leilão SFI",
            "Concorrência Pública",
            "Leilão SFI - Edital Único",
            "Licitação Aberta",
            "Venda Direta FAR",
            "Venda Direta Online",
            "Venda Online",
            'Venda Direta'
        ];
        let tipo_leilao = 'Venda Online'

        // Regex para capturar o valor numérico
        const regex = /R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2})/g
                 


        const endereco = $('strong:contains("Endereço:")').parent().text().replace("Endereço:", "").trim() || ''
        const descricao = $('strong:contains("Descrição:")').parent().text().replace("Descrição:", "").trim() || ''
        const titulo = $('h5').text().trim().split('\n')[0] || ''
        const codigo = $('span:contains("Número do imóvel:") strong').text().trim().replace('-', '') || ''
        const tipo_imovel = $('span:contains("Tipo de imóvel:") strong').text().trim() || ''
        const tipo_leilao_extraido = $('.related-box').text()?.trim().split('\n')[0] || ''
        const numero_item = $('.related-box span:contains("Número do item:")').text().trim().split(' ')[3] || ''
        const area_privativa = $('span:contains("Área privativa =") strong').text().trim().replace('.', '').replace(',', '.').replace(/m2.*/, '') || ''
        const area_total = $('span:contains("Área total =") strong').text().trim().replace('.', '').replace(',', '.').replace(/m2.*/, '') || ''
        const area_terreno = $('span:contains("Área do terreno =") strong').text().trim().replace('.', '').replace(',', '.').replace(/m2.*/, '') || ''
        const quartos = $('span:contains("Quartos:") strong').text().trim() || ''
        const garagem = $('span:contains("Garagem:") strong').text().trim() || ''
        let valor_avaliacao = $('p:contains("Valor de avaliação:")').text()
        if(valor_avaliacao) valor_avaliacao = valor_avaliacao.match(regex)[0].replace(/\./g, '').replace(',', '.').replace('R$ ', '') || ''
        let valor_venda = $('p:contains("Valor mínimo de venda")').text()
                      ||  $('p:contains("Valor de venda")').text()
        if(valor_venda) valor_venda = valor_venda.match(regex)[1].replace(/\./g, '').replace(',', '.').replace('R$ ', '')
        const leiloeiro = $('span:contains("Leiloeiro(a):")').text().trim().split(':')[1]?.trim() || '' 
        const matricula = $('span:contains("Matrícula(s):") strong').text().trim() || ''
        let link_matricula = $('a:contains("Baixar matrícula do imóvel")') || ''
        if(link_matricula) link_matricula = link_matricula.attr('onclick').match(/'([^']+)'/)[1]
        const inscricao_imobiliaria = $('span:contains("Inscrição imobiliária:") strong').text()?.trim() || ''
        const averbacao_leioes_negativos = $('span:contains("Averbação dos leilões negativos:") strong').text()?.trim() || ''
        const oficio = $('span:contains("Ofício:") strong').text().trim() || ''
        const comarca = $('span:contains("Comarca:") strong').text().trim() || ''
        let edital = $('a:contains("Baixar edital e anexos")').attr('onclick') || '';
        if(edital) edital = edital.match(/'([^']+)'/)[1]
        const fotos = $('.thumbnails img').map((i, el) => $(el).attr('src')).get() || ''

        const infos_adicionais = $('strong:contains("Descrição:")').parent().next().text()
            .replace(/\t/g, "")
            .replace(/\n/g, " ").split('.')
            .map(item => item.trim())
            .filter(item => item !== '') || '';

        // Verifica qual tipo de licitação corresponde ao texto extraído
        tiposPossiveis.forEach(tipo => {
            if (tipo_leilao_extraido.includes(tipo)) {
                tipo_leilao = tipo;
            }
        });


        let data = {
            titulo,
            codigo,
            tipo_imovel,
            tipo_leilao,
            numero_item,
            area_privativa,
            area_total,
            quartos,
            garagem,
            valor_avaliacao,
            valor_venda,
            desconto: (1-(valor_venda/valor_avaliacao)).toFixed(2),
            leiloeiro,
            endereco,
            matricula,
            link_matricula,
            inscricao_imobiliaria,
            averbacao_leioes_negativos,
            oficio,
            descricao,
            comarca,
            edital,
            fotos,
            infos_adicionais,
            area_terreno
        };

        return data;

    } catch (error) {
        console.error('Codigo do imovel: ', imovel_cod);
        throw error; // Lança o erro para ser capturado por quem chama a função
    }
}

module.exports = {
    buscarCidadesPorEstados,
    buscaListaImoveisPorCidade,
    buscaDetalhesImovel
    // outras funções ou valores exportados
};



// salva lista de paginação -> inversão de responsabilidade
// salva lista de imoveis por paginação
// busca detalhes do imovel

/**
 * a aquisição será de maneira assíncrona
 * quando o processo for iniciado, será criado um registro na tabela de processos
 * quando o processo for finalizado, será atualizado o registro na tabela de processos
 *
 */


// Função wrapper assíncrona para permitir o uso de await
// async function main() {
// const imoveis = [
//     '08787703125021',
//     '08787707461085',
//     '08787708576633',
//     '00000010163268',
//     '08555535948665',
//     '08555538515050',
//     '08555538823480',
//     '08555538880735',
//     '08787704846431',
//     '08787706142300',
//     '08787706107105',
//     '08555536326013',
//     '01444407721064'
// ]

// const data = await buscaDetalhesImovel('8444403075840');

// console.log(data);
// try {
//     imoveis.forEach(async (imovel) => {
//         console.log(data);
//     });

// } catch (error) {
//     console.error('Erro:', error);
// }
// }

// main();