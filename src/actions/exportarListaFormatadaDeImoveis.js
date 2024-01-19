const { format } = require('date-fns');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const { Imovel } = require('../models/imovelModel');

mongoose.connect('mongodb+srv://bobson:e2pBDvHeMEYRo1y0@robson-db.oexrl0x.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


const exportarImoveisParaXlsx = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Define a data para o início do dia atual.
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Define a data para o início do próximo dia
    

    try {
        const imoveis = await Imovel.find({
          ativo: true
        });

        console.log(`Exportando ${imoveis.length} imóveis para XLSX...`);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Imoveis');

        // Definindo as colunas
        worksheet.columns = [
            { header: 'ORIGEM', key: 'origem', width: 12 },
            { header: 'ESTADO', key: 'uf', width: 10 },
            { header: 'CIDADE', key: 'cidade', width: 30 },
            { header: 'TIPO IMÓVEL', key: 'tipo_imovel', width: 15 },
            { header: 'TIPO LEILÃO', key: 'tipo_leilao', width: 30 },
            { header: 'TÍTULO', key: 'titulo', width: 30 },
            { header: 'CÓDIGO', key: 'codigo', width: 30 },
            { header: 'NÚMERO ITEM', key: 'numero_item', width: 16 },
            { header: 'VALOR_AVALIACAO', key: 'valor_avaliacao', width: 21 },
            { header: 'VALOR VENDA', key: 'valor_venda', width: 16 },
            { header: 'ÁREA TOTAL', key: 'area_total', width: 14 },
            { header: 'AREA PRIVATIVA', key: 'area_privativa', width: 18 },
            { header: 'AREA TERRENO', key: 'area_terreno', width: 16 },
            { header: 'QUARTOS', key: 'quartos', width: 12 },
            { header: 'GARAGEM', key: 'garagem', width: 12 },
            { header: 'BANHEIROS', key: 'banheiros', width: 13 },
            { header: 'ENDEREÇO', key: 'endereco', width: 60 },
            { header: 'DESCRIÇÃO', key: 'descricao', width: 60 },
            { header: 'INFORMAÇÕES ADICIONAIS', key: 'infos_adicionais', width: 45 },
            { header: 'LEILOEIRO', key: 'leiloeiro', width: 45 },
            { header: 'TEMPO RESTANTE', key: 'tempo_restante', width: 19 },
            { header: 'FOTOS', key: 'fotos', width: 60 },
            { header: 'MATRÍCULA', key: 'matricula', width: 14 },
            { header: 'AÇÃO JUDICIAL', key: 'acao_judicial', width: 17 },
            { header: 'LINK MATRÍCULA', key: 'link_matricula', width: 18 },
            { header: 'INSCRICAO IMOBILIARIA', key: 'inscricao_imobiliaria', width: 25 },
            { header: 'AVERBAO LEILÕES NEGATIVOS', key: 'averbacao_lelioes_negativos', width: 30 },
            { header: 'OFÍCIO', key: 'oficio', width: 9 },
            { header: 'COMARCA', key: 'comarca', width: 20 },
            { header: 'EDITAL', key: 'edital', width: 9 },
            { header: 'DATA', key: 'updatedAt', width: 12 },
        ];

        // Adicionando as colunas da tabela
        const columns = [
            { name: 'ORIGEM', filterButton: true },
            { name: 'ESTADO', filterButton: true },
            { name: 'CIDADE', filterButton: true },
            { name: 'TIPO IMÓVEL', filterButton: true },
            { name: 'TIPO LEILÃO', filterButton: true },
            { name: 'TÍTULO', filterButton: true },
            { name: 'CÓDIGO', filterButton: true },
            { name: 'NÚMERO ITEM', filterButton: true },
            { name: 'VALOR_AVALIACAO', filterButton: true },
            { name: 'VALOR VENDA', filterButton: true },
            { name: 'ÁREA TOTAL', filterButton: true },
            { name: 'AREA PRIVATIVA', filterButton: true },
            { name: 'AREA TERRENO', filterButton: true },
            { name: 'QUARTOS', filterButton: true },
            { name: 'GARAGEM', filterButton: true },
            { name: 'BANHEIROS', filterButton: true },
            { name: 'ENDEREÇO', filterButton: true },
            { name: 'DESCRIÇÃO', filterButton: true },
            { name: 'INFORMAÇÕES ADICIONAIS', filterButton: true },
            { name: 'LEILOEIRO', filterButton: true },
            { name: 'TEMPO RESTANTE', filterButton: true },
            { name: 'FOTOS', filterButton: true },
            { name: 'MATRÍCULA', filterButton: true },
            { name: 'AÇÃO JUDICIAL', filterButton: true },
            { name: 'LINK MATRÍCULA', filterButton: true },
            { name: 'INSCRICAO IMOBILIARIA', filterButton: true },
            { name: 'AVERBAO LEILÕES NEGATIVOS', filterButton: true },
            { name: 'OFÍCIO', filterButton: true },
            { name: 'COMARCA', filterButton: true },
            { name: 'EDITAL', filterButton: true },
            { name: 'DATA', filterButton: true },
        ];

        // Convertendo os dados dos imóveis para o formato de linhas da tabela
        const rows = imoveis.map(imovel => [
            imovel.origem,
            imovel.uf,
            imovel.cidade,
            imovel.tipo_imovel,
            imovel.tipo_leilao,
            imovel.titulo,
            imovel.codigo,
            imovel.numero_item,
            imovel.valor_avaliacao,
            imovel.valor_venda,
            imovel.area_total,
            imovel.area_privativa,
            imovel.area_terreno,
            imovel.quartos,
            imovel.garagem,
            imovel.banheiros,
            imovel.endereco,
            imovel.descricao,
            imovel.infos_adicionais.join('\n'),
            imovel.leiloeiro,
            imovel.tempo_restante,
            imovel.fotos.map(foto => `https://venda-imoveis.caixa.gov.br${foto}`).join('\n '),
            imovel.matricula,
            imovel.acao_judicial,
            imovel.link_matricula.length > 0 ?
                {
                    text: 'Link Matricula',
                    hyperlink: `https://venda-imoveis.caixa.gov.br/${imovel.link_matricula}`,
                    tooltip: 'Clique para abrir o link no navegador',
                } : '',
            // 'https://venda-imoveis.caixa.gov.br/sistema' + imovel.link_matricula,
            imovel.inscricao_imobiliaria,
            imovel.averbacao_lelioes_negativos,
            imovel.oficio,
            imovel.comarca,
            imovel.edital.length > 0 ? {
                text: 'Edital',
                hyperlink: `https://venda-imoveis.caixa.gov.br/${imovel.edital}`,
                tooltip: 'Clique para abrir o link no navegador',
            } : '',
            // 'https://venda-imoveis.caixa.gov.br/sistema' + imovel.edital,
            imovel.updatedAt,
        ]);


        // Adicionando a tabela à planilha
        worksheet.addTable({
            name: 'ImoveisTable',
            ref: 'A1',
            headerRow: true,
            style: {
                showRowStripes: true,
            },
            columns: columns,
            rows: rows,
        });

        // Ajustando a altura das linhas para itens com quebras de linha
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                if (typeof cell.value === 'string' && cell.value.includes('\n')) {
                    row.height = 60; // Ajuste conforme necessário
                }
            });
        });

        // Aplicando estilo zebra (cores alternadas) nas linhas
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {

            // Definindo a cor da borda para todas as células da linha como azul escuro
            row.eachCell({ includeEmpty: true }, function (cell) {
                // Centralizando o texto e ativando a quebra de linha
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'left',
                    wrapText: true
                };

            });


        })

        // Importar o módulo 'format' da biblioteca 'date-fns' para formatar a data

        // Gerar a data e hora atual formatada como 'YYYY-MM-DD_HH-mm-ss'
        const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');

        // Concatenar a data e hora atual ao nome do arquivo
        const fileName = `Imoveis_f2_${currentDateTime}.xlsx`;

        // Escrever o arquivo XLSX com o novo nome
        await workbook.xlsx.writeFile(fileName);

        console.log('Arquivo exportado com sucesso!');

    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    } finally {
        mongoose.disconnect();
    }
};

exportarImoveisParaXlsx();
