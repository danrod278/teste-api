const repository = require('../repositories/cidadeRepository')

exports.listarCidades = async (req, res) => {
  try {
    const cidades = await repository.getCidadesByUF(req.params.uf);
    res.status(200).send(cidades);
  } catch (error) {
    console.error(error);
    res.status(500).send({ Erro: error.message });
  }
}