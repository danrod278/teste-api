const getImovelVendaOnline = async (codigoImovel) => {

    const url = 'https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=' + codigoImovel;

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const imovel = {};

    imovel.codigo = codigoImovel;
    imovel.tipo = $('#ctl00_conteudo_lblTipoImovel').text().trim();
    imovel.endereco = $('#ctl00_conteudo_lblEndereco').text().trim();
    imovel.bairro = $('#ctl00_conteudo_lblBairro').text().trim();
    imovel.cidade = $('#ctl00_conteudo_lblCidade').text().trim();
    imovel.uf = $('#ctl00_conteudo_lblUf').text().trim();
    imovel.valor = $('#ctl00_conteudo_lblValorImovel').text().trim();
    imovel.valorMinimo = $('#ctl00_conteudo_lblValorMinimo').text().trim();
    imovel.valorAvaliacao = $('#ctl00_conteudo_lblValorAvaliacao').text().trim();
    imovel.dataLance = $('#ctl00_conteudo_lblDataLance').text().trim();
    imovel.dataLeilao = $('#ctl00_conteudo_lblDataLeilao').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();
    imovel.dataDisponivel = $('#ctl00_conteudo_lblDataDisponivel').text().trim();

    return imovel;
}