const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            minlength: [3, 'O nome deve ter pelo menos 3 caracteres'],
            maxlength: [50, 'O nome não pode ter mais de 50 caracteres'],
            unique: true
        },
        UF: {
            type: String,
            required: true,
            unique: true
        },
        codigo: {
            type: Number,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const Cidade = mongoose.model('Cidade', schema)

exports.Cidade = Cidade