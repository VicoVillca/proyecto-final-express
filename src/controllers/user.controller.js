import {User} from '../models/user.js'
import { Task } from '../models/task.js'
import logger from '../logs/logger.js'

async function create(req, res) {
  const { username, password } = req.body
  try {
    const newUser = await User.create({ 
      username,
      password
    })
    res.json(newUser)
  } catch (error) {
    return res.json(error)
  }
}

async function get(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'password', 'status']
    })
    res.json(users)
  } catch (error) {
    return res.json(error)
  }
}

async function find(req, res) {
  const {id} = req.params;
  console.log(id);
  try {
    const user = await User.findOne({
      attributes: ['username', 'status'],
      where:{
        id
      }
    });
    if(!user)
      return res.status(404).json({message: 'Usuario no encontrado'})
    res.json(user)
  } catch (error) {
    return res.json(error)
  }
}

export default {
  create,
  get,
  find
}