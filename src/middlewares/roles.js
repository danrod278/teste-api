const routeByPass = require('../helpers/routeByPass')

module.exports = async (req, res, next) => {
  console.log(req)
  if (req.userRole === 'admin') {
    console.log("Entrou no middleware")
    next()
  } else {
    console.log("Entrou no middleware fail")
    res.status(403).json({
      message: 'Esta funcionalidade é restrita para administradores',
    })
  }
}