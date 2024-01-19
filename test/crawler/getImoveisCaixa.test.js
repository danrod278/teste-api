const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const imovel = require('../moks/getImovel.mock')

const { buscarCidadesPorEstados, buscaListaImoveisPorCidade, buscaDetalhesImovel } = require('../../src/crawler/caixa/getImoveisCaixa');


// jest.mock('axios');

describe('buscarCidadesPorEstados', () => {
    it('should return the list of cities for a given state', async () => {
      // Mock the axios.post method to return a mocked response
      axios.post.mockResolvedValueOnce({
        data: `
          <option value='1'>City 1</option>
          <option value='2'>City 2</option>
          <option value='3'>City 3</option>
        `,
      });
  
      // Define the expected data
      const expectedData = [
        { nome: 'City 1', UF: 'UF', codigo: '1' },
        { nome: 'City 2', UF: 'UF', codigo: '2' },
        { nome: 'City 3', UF: 'UF', codigo: '3' },
      ];
  
      // Call the function with a mock state
      const result = await buscarCidadesPorEstados('UF');
  
      // Assert that the returned data matches the expected data
      expect(result).toEqual(expectedData);
    });

    it('should return the list of properties for a given city', async () => {
        // Mock the axios.post method to return a mocked response
        axios.post.mockResolvedValueOnce({
            data: `
            <input type='hidden' name='hdnImov1' id='hdnImov1' value='08787703125021||08787707461085'>
            <input type='hidden' name='hdnImov2' id='hdnImov2' value='08787706107105||08555536326013'>
            <input type='hidden' name='hdnFiltro' id='hdnFiltro' value='SP||9090||||||4||0,'>
            <input type='hidden' name='hdnQtdPag' id='hdnQtdPag' value='2'>
            <input type='hidden' name='hdnPagNum' id='hdnPagNum' value='1'>
            <input type='hidden' name='hdnQtdRegistros' id='hdnQtdRegistros' value='2'>
            <span class='legend-desc lighter milli'>Foram encontrados 2 imóveis.</span>
            `,
        });
    
        // Define the expected data
        const expectedData = {
            paginas: '2',
            total_registros: '2',
            imoveis: [
                { imovel_cod: ['08787703125021', '08787707461085'], imovel_id: 'hdnImov1' },
                { imovel_cod: ['08787706107105', '08555536326013'], imovel_id: 'hdnImov2' }
            ]
        };
        
        // Call the function with a mock state
        const result = await buscaListaImoveisPorCidade('UF', '9090');
    
        // Assert that the returned data matches the expected data
        expect(result).toEqual(expectedData);
    });
    
    });
    
    describe('buscaDetalhesImovel', () => {
    it.only('should return the details of an imovel', async () => {
        // Mock the axios.post method to return a mocked response
        // axios.post.mockResolvedValueOnce({
        //     data: imovel,
        // });

        // Define the expected data
        const expectedData = {
            titulo: 'COND RES PQ ANGRA DOS REIS',
            codigo: '878770312502-1',
            tipo_imovel: 'Apartamento',
            tipo_leilao: 'Licitação Aberta',
            numero_item: '206',
            area_privativa: '39.30',
            area_total: '',
            quartos: '2',
            garagem: '1',
            valor_avaliacao: '145000.00',
            valor_venda: '87000.00',
            leiloeiro: 'BRENNO DE FIGUEIREDO PORTO',
            endereco: 'AVENIDA PRESIDENTE COSTA E SILVA,N. 503 APTO. 202 BL 04, CONJUNTO HABITACIONAL NARCISO GOMES - CEP: 13601-445, ARARAS - SAO PAULO',     
            matricula: '61410',
            link_matricula: '/editais/matricula/SP/8787703125021.pdf',
            inscricao_imobiliaria: '2120557003054',
            averbacao_leioes_negativos: 'A realizar',
            oficio: '01',
            descricao: "2  Quartos, 1 Vaga na Garagem,  Área de Serviço,  Wc,  Sala,  Cozinha. Vaga Descoberta de Estacionamento Para Guarda de Veículo de Passeio, Tamanho Pequeno e Médio, Identificada Pelo nº 136.",
            comarca: 'ARARAS-SP',
            edital: '/editais/EA00030323CPVERE.PDF',
            fotos: [ '/fotos/F878770312502121.jpg' ],
            opcoesFinanciamento: {
              fgts: null,
              financiamento: false,
              parcelamento: false,
              consorcio: false
            }
        };

        // Call the function with a mock imovel_cod
        const result = await buscaDetalhesImovel('08787703125021');

        // Assert that the returned data matches the expected data
        expect(result).toEqual(expectedData);

    });

    it('should throw an error if there is an error in the request', async () => {
        // Mock the axios.post method to throw an error
        axios.post.mockRejectedValueOnce(new Error('Mocked error'));

        // Call the function with a mock imovel_cod
        await expect(buscaDetalhesImovel('mocked_imovel_cod')).rejects.toThrow('Mocked error');
    });
});