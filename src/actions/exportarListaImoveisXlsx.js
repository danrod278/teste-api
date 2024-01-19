const mongoose = require('mongoose');
const XLSX = require('xlsx');
const { Imovel } = require('../models/imovelModel'); // Substitua pelo caminho correto do seu modelo

mongoose.connect('mongodb+srv://bobson:e2pBDvHeMEYRo1y0@robson-db.oexrl0x.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const exportarImoveisParaXlsx = async () => {
    try {
        // Buscar todos os imóveis
        const imoveis = await Imovel.find({});

        const dadosProcessados = imoveis.map(imovel => {
            const imovelObj = imovel.toObject();
            return {
                'ORIGEM': imovelObj.origem,
                'ESTADO': imovelObj.uf,
                'CIDADE': imovelObj.cidade,
                'TIPO IMÓVEL': imovelObj.tipo_imovel,
                'TIPO LEILÃO': imovelObj.tipo_leilao,
                'TÍTULO': imovelObj.titulo,
                'CÓDIGO': imovelObj.codigo,
                'NÚMERO ITEM': imovelObj.numero_item,
                'VALOR_AVALIACAO': imovelObj.valor_avaliacao,
                'VALOR VENDA': imovelObj.valor_venda,
                'ÁREA TOTAL': imovelObj.area_total,
                'AREA PRIVATIVA': imovelObj.area_privativa,
                'AREA TERRENO': imovelObj.area_terreno,
                'QUARTOS': imovelObj.quartos,
                'GARAGEM': imovelObj.garagem,
                'BANHEIROS': imovelObj.banheiros,
                'ENDEREÇO': imovelObj.endereco,
                'DESCRIÇÃO': imovelObj.descricao,
                'INFORMAÇÕES ADICIONAIS': imovelObj.infos_adicionais.join('\n'),
                'LEILOEIRO': imovelObj.leiloeiro,
                'TEMPO RESTANTE': imovelObj.tempo_restante,
                'FOTOS': imovelObj.fotos.join('\n '),
                'MATRÍCULA': imovelObj.matricula,
                'AÇÃO JUDICIAL': imovelObj.acao_judicial,
                'LINK MATRÍCULA': imovelObj.link_matricula,
                'INSCRICAO IMOBILIARIA': imovelObj.inscricao_imobiliaria,
                'AVERBAO LEILÕES NEGATIVOS': imovelObj.averbacao_lelioes_negativos,
                'OFÍCIO': imovelObj.oficio,
                'COMARCA': imovelObj.comarca,
                'EDITAL': imovelObj.edital,
                'DATA': imovelObj.updatedAt,
            };
        });


        // Criar uma planilha com os dados
        const worksheet = XLSX.utils.json_to_sheet(dadosProcessados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Imoveis");

        // Escrever o arquivo XLSX
        XLSX.writeFile(workbook, 'Imoveis.xlsx');
        console.log('Arquivo exportado com sucesso!');

    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    } finally {
        mongoose.disconnect();
    }
};

exportarImoveisParaXlsx();
