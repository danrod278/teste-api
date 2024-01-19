const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {
        titulo: {
            type: String,
        },
        codigo: {
            type: String
        },
        tipo_imovel:{
            type: String,
            enum: [
            'Apartamento', 
            'Casa', 
            'Sala', 
            'Terreno', 
            'rural', 
            'Prédio', 
            'Loja', 
            'Galpão', 
            'Comercial', 
            'Industrial', 
            'Gleba'],
            required: true
        },
        tipo_leilao:{
            type: String,
            enum: [
            "1º Leilão SFI",
            "2º Leilão SFI",
            "Concorrência Pública",
            "Leilão SFI - Edital Único",
            "Licitação Aberta",
            "Venda Direta FAR",
            "Venda Direta Online",
            "Venda Online"],
            required: true
        },
        numero_item: {
            type: String
        },
        uf: {
            type: String,
            required: true,
            maxlength: 2
        },
        cidade: {
            type: String,
            required: true
        },
        area_total: {
            type: Number
        },
        area_privativa: {
            type: Number
        },
        area_terreno: {
            type: Number
        },
        quartos: {
            type: Number
        },
        garagem: {
            type: Number
        },
        banheiros: {
            type: Number
        },
        tempo_restante:{
            type: String
        },
        valor_avaliacao: {
            type: Number,
            required: true
        },
        valor_venda: {
            type: Number,
            required: true
        },
        desconto: {
            type: Number,
            required: false
        },
        origem: {
            type: String,
            default: 'Caixa',
            required: true
        },
        leiloeiro: {
            type: String
        },
        endereco: {
            type: String,
            required: true
        },
        infos_adicionais: {
            type: [String]
        },
        acao_judicial: {
            type: String
        },
        fotos: {
            type: [String]
        },
        matricula: {
            type: String
        },
        link_matricula: {
            type: String
        },
        inscricao_imobiliaria: {
            type: String
        },
        averbacao_lelioes_negativos: {
            type: String
        },
        oficio: {
            type: String
        },
        descricao: {
            type: String
        },
        comarca: {
            type: String
        },
        edital: {
            type: String
        },
        ativo: {
            type: Boolean,
            default: true
        },
        aceita_fgts: {
            type: Boolean,
            default: true
        },
        aceita_financiamento: {
            type: Boolean,
            default: true
        },
        aceita_consorcio: {
            type: Boolean,
            default: true
        },
        aceita_parcelamento: {
            type: Boolean,
            default: true
        },
        status: {
            type: Boolean,
            default: true

        }
    },
    {
        timestamps: true,
    }
)

const Imovel = mongoose.model('Imovel', schema)

exports.Imovel = Imovel
