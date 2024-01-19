"use strict";
// const mongoose = require("mongoose");
const { User } = require("../models/userModel.js");

exports.create = async (data) => {
  // Verifica se o e-mail já existe
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error('E-mail já cadastrado');
  }

  var user = new User(data);
  await user.save();
  
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt
  };
};


exports.findById = async (id) => {
  try {
    return await  User.findOne({ _id: id })
  } catch (e) {
    throw e
  }
};

exports.findUserRegistred = async (email, password) => {
  const user = await User.findOne({ email, password });
  
  if (!user) {
    
    return null;
  }

  return user;
};


exports.findAll = async () => {
  return await User.find({})
};