import { User } from '../models/user.js'
import { Task } from '../models/task.js'
import logger from '../logs/logger.js'
import { encriptar } from '../common/bycript.js'
import { Status } from '../constants/index.js'

async function create(req, res) {
  const { username, password } = req.body
  try {
    const newUser = await User.create({ 
      username,
      password
    })
    res.json(newUser)
  } catch (error) {
    return res.json(error.message)
  }
}

async function get(req, res) {
  try {
    const users = await User.findAndCountAll({
      attributes: ['id', 'username', 'password', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE
      }
    })
    res.json({
      total: users.count,
      data: users.rows
    })
  } catch (error) {
    return res.json(error.message)
  }
}

async function find(req, res) {
  const {id} = req.params;
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
    return res.json(error.message)
  }
}

async function update(req, res) {
  const {id} = req.params;
  const {username, password} = req.body;
  const passwordHash = await encriptar(password);
  try {
    const user = await User.update(
      {
        username,
        password: passwordHash
      },
      { where: { id }}
    );
    return res.json(user)
  } catch (error) {
    return res.json(error.message)
  }
}

const activeInactive = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'El campo "status" es requerido' });
  }

  try {
    const user = await User.findByPk(id);
    if(!user){
      return res.status(400).json({ message: 'El usuario no existe' });
    }
    if(user.status === status) {
      return res
        .status(409)
        .json({ message: `El usuario ya está ${status ? 'activo' : 'inactivo'}` });
    }

    user.status = status;
    await user.save();
    res.json(user)
  } catch (error) {
    return res.json(error.message)
  }
}

const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.destroy({ where: { userId: id } });
    await User.destroy({ where: { id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.json(error.message);
  }
}


export default {
  create,
  get,
  find,
  update,
  activeInactive,
  eliminar
}