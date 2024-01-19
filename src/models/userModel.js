const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        minlength: [3, 'O nome deve ter pelo menos 3 caracteres'],
        maxlength: [50, 'O nome não pode ter mais de 50 caracteres'],
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: false,
        default: 'user',
        enum: ['user', 'admin',],
    },
    status:{
        type: Boolean,
        required: false,
        default: false
    }
},  {
    timestamps: true
   })

const User = mongoose.model('User', schema)
exports.User = User

