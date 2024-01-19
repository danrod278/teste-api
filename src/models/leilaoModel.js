const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {
        nome: {
            type: String,
            required: [true, 'O título é obrigatório'],
            minlength: [3, 'O título deve ter pelo menos 3 caracteres'],
            maxlength: [50, 'O título não pode ter mais de 50 caracteres'],
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        tipo: {
            type: [String],
            required: true,
            default: ['IMÓVEL'],
            enum: ['IMÓVEL', 'VEÍCULOS', 'OUTROS'],
            set: v => Array.isArray(v) ? v.map(str => str.toUpperCase()) : v
        },        
        uri: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true,
    }   
)

const Leilao = mongoose.model('leilao', schema)

exports.Leilao = Leilao