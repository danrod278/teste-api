const userService = require('../services/userService')

exports.create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(200).send(user);
  } catch (error) {
    if (error.message === 'E-mail já cadastrado') {
      res.status(400).send({ message: 'E-mail já cadastrado' });
    } else {
      res.status(500).send({ message: 'Erro interno' });
    }
  }
}

exports.findAll = async (req, res, next) => {
 
  try {
    const user = await userService.findAll();
    res.status(200).send(user);
  } catch (error) {
    console.log(error)
    if (error.message === 'E-mail já cadastrado') {
      res.status(400).send({ message: 'E-mail já cadastrado' });
    } else {
      res.status(500).send({ message: 'Erro interno' });
    }
  }
}

exports.findUser = async (req, res, next) => {
  try {
    const user = await userService.find(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error.message)
    if (error.message.includes('ObjectId')) {
      res.status(400).send({ message: 'Id de usuário não encontrado' });
    } else {
      res.status(500).send({ message: 'Erro interno' });
    }
  }
}

exports.register = async (req, res, next) => {
  const { nome, email, password } = req.body;
  try {
    const user = await userService.create({ nome, email, password } );
    res.status(200).send(user);
  } catch (error) {
    if (error.message === 'E-mail já cadastrado') {
      res.status(400).send({ message: 'E-mail já cadastrado' });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
}

exports.createUserDefault = async (req, res, next) => {
  try {
    const user = await userService.create(
      {
        nome: "default",
        email: "default@admin.com",
        password: 123456,
        role: "admin",
        status: true
      }
    );
    res.status(200).send(user);
  } catch (error) {
    if (error.message === 'E-mail já cadastrado') {
      res.status(400).send({ message: 'Usuário default existente. O usuário default só pode ser criado uma vez!' });
    } else {
      res.status(500).send({ message: 'Erro interno' });
    }
  }
}

exports.getCharges = async (req, res, next) => {
  return res.status(200).send({
    message: "Rota para registro de usuário",
    requirements: "requer usuário autenticado",
    status: "implementar controller, service e repository"
  })
}

exports.login = async (req, res, next) => {
  try {
      const data = await userService.authenticate(req.body.email, req.body.password);
      if (data) {
          res.status(200).send({  nome: data.nome, token: data.token });
      } else {
          res.status(401).send({ message: 'Email or password is incorrect.' });
      }
  } catch (error) {
      res.status(500).send({ message: 'Internal server error', error });
  }
};