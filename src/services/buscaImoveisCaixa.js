const estados = require('../enums/estados');
const { buscarCidadesPorEstados, buscaListaImoveisPorCidade, buscaDetalhesImovel } = require('../crawler/caixa/getImoveisCaixa');
const cidadeRepository = require('../repositories/cidadeRepository');
const imovelRepository = require('../repositories/imovelRepository');
const { performance } = require('perf_hooks');
const { getFormattedDate } = require('../helpers/date.helper');
const { da } = require('date-fns/locale');

exports.salvaCodigosCidades = async () => {
    for (const uf of Object.keys(estados)) {
        try {
            const cidades = await buscarCidadesPorEstados(uf);
            await cidadeRepository.createMany(cidades);
            console.log(`${getFormattedDate()} - ${cidades.length} registros inseridos com sucesso para o estado ${uf}!`);
        } catch (error) {
            console.error(`${getFormattedDate()} - Erro ao inserir registros para o estado ${uf}: ${error.message}`);
        }
    }
    console.log('Todos os registros foram processados.');
};




/**
 * 
 * @param {*} cidade 
 * 
 * converter para buscar a lista de imóveis por cidade salvar em uma tabela e depois buscar os detalhes de cada imóvel
 * implementar o sistema de fila para buscar os detalhes dos imóveis
 * caso o sistema entre em pane, quando retornar, deve continuar de onde parou
 */
exports.salvarImoveisCidade = async (cidade) => {
    let count = 0;
    cidade = await cidadeRepository.getCidadeByNome(cidade);

    try {
        const data_cidade = await buscaListaImoveisPorCidade(cidade.UF, cidade.codigo);

        // Limitar a busca aos primeiros 4 imóveis
        let imoveisParaBuscar = data_cidade.imoveis;

        // Executar cada busca de detalhes de imóvel sequencialmente
        for (const imovel of imoveisParaBuscar) {
            try {
                const start = performance.now();
                const data_imovel = await buscaDetalhesImovel(imovel);
                console.log(`${getFormattedDate()} - Imóvel ${data_imovel.codigo} salvo com sucesso! UF: ${cidade.UF}, Cidade: ${cidade.nome} | Tempo decorrido: ${(performance.now() - start) / 1000} segundos`);

                let novoImovel = { leilao: '655750f7124d7a12826ca2b6', uf: cidade.UF, cidade: cidade.nome, ...data_imovel };
                await imovelRepository.newImovel(novoImovel);
                count++;
            } catch (error) {
                try {
                    imovelRepository.newImovelErro({ codigo: imovel, mensagem: error.message });
                } catch (error) {
                    console.error(`${getFormattedDate()} - Erro ao salvar imóvel com erro: ${imovel}`, error.message);
                }
                console.error(`${getFormattedDate()} - Erro ao buscar detalhes do imóvel código: ${imovel}`, error.message);
            }
        }

        console.log(`${getFormattedDate()} - Total de imoveis salvos: ` + count);
    } catch (error) {
        console.error(`${getFormattedDate()} - Erro ao buscar lista de imóveis: `, error.message);
    }
};

exports.salvarImoveisEstado = async (UF) => {
    const start = performance.now();
    const cidades = await cidadeRepository.getCidadesByUF(UF);
    console.log(`${getFormattedDate()} - Buscando imóveis do estado ${UF}`);

    for (const cidade of cidades) {
        console.log(`${getFormattedDate()} - Buscando imóveis da cidade ${cidade.nome}`);
        await this.salvarImoveisCidade(cidade.nome, 1); // Passar 4 como limite de imóveis por cidade
    }

    console.log(`${getFormattedDate()} - Todos os imóveis do estado ${UF} foram salvos!, tempo de execução: ${(performance.now() - start) / 1000} segundos`);
};

exports.salvarTodosImoveis = async () => {
    const start = performance.now();
    const ufs = Object.keys(estados);

    for (const uf of ufs) {
        console.log(`${getFormattedDate()} - Processando o estado: ${uf}...`);
        await this.salvarImoveisEstado(uf);
    }

    const end = performance.now();
    console.log(`${getFormattedDate()} - Tempo total: ${(end - start) / 1000} segundos`);
    console.log(`${getFormattedDate()} - Todos os imóveis foram salvos!`);
};

/**
 * 
 */