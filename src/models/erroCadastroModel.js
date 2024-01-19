const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {

        codigo: {
            type: String
        },
        mensagem: {
            type: String
        },
    },
    {
        timestamps: true,
    }
)

const ImovelErro = mongoose.model('ImovelErro', schema)

exports.ImovelErro = ImovelErro
