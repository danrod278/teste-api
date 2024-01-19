'use strict';
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const md5 = require('md5')

exports.create = async (data) => {

    data = {
        nome: data.nome,
        email: data.email,
        role: data?.role,
        password: md5(data.password + global.SALT_KEY),
        status: data?.status
    }

    return await userRepository.create(data)
}

exports.findAll = async () => {
    return await userRepository.findAll()
}

exports.find = async (id) => {
    try {
        return await userRepository.findById(id)
    } catch (e) {
        throw e
    }
}


exports.authenticate = async (email, password) => {
    try {
        const user = await userRepository.findUserRegistred(email, md5(password + global.SALT_KEY));
        if (user) {
            const tokenData = { id: user.id, email: user.email, role: user.role, nome: user.nome, status: user.status };
            try {
                const token = jwt.sign(tokenData, global.SALT_KEY, { expiresIn: '30d' });
                return { token, nome: user.nome }
            } catch (error) {
                console.log(error)
            }
        }
    } catch (e) {
        console.error('Error in authenticate:', error.message);
        throw error;
    }

};