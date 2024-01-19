function buildQueryConditions(data) {
    const { 
        query, 
        minValorAvaliacao, maxValorAvaliacao, 
        minValorVenda, maxValorVenda, 
        ativo, fgts, financiamento, 
        minDesconto, maxDesconto 
    } = data;

    const conditions = { ...query };

    // Adicionando condições de valor
    if (minValorAvaliacao) conditions.valor_avaliacao = { $gte: minValorAvaliacao };
    if (maxValorAvaliacao) conditions.valor_avaliacao = { ...conditions.valor_avaliacao, $lte: maxValorAvaliacao };
    if (minValorVenda) conditions.valor_venda = { $gte: minValorVenda };
    if (maxValorVenda) conditions.valor_venda = { ...conditions.valor_venda, $lte: maxValorVenda };
    if (minDesconto) conditions.desconto = { $gte: minDesconto };
    if (maxDesconto) conditions.desconto = { ...conditions.desconto, $lte: maxDesconto };
    if (ativo) conditions.ativo = true

    // Condições de informações adicionais
    let infosAdicionaisConditions = [];
    if (fgts) infosAdicionaisConditions.push({ infos_adicionais: { $not: /FGTS/gi } });
    if (financiamento) infosAdicionaisConditions.push({ infos_adicionais: { $not: /NÃO aceita financiamento/gi } });

    if (infosAdicionaisConditions.length > 0) {
        conditions.$and = infosAdicionaisConditions;
    }

    return conditions;
}

function calculatePagination(data, totalRegistros) {
    const pagina = parseInt(data.pagina) || 1;
    const max = parseInt(data.max) || 10;

    const totalPaginas = Math.max(Math.ceil(totalRegistros / max), 1);
    const paginaAtual = Math.min(pagina, totalPaginas);

    return { paginaAtual, max, totalPaginas };
}

module.exports = { calculatePagination, buildQueryConditions }