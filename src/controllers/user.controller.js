import { User } from '../models/user.js'
import { Task } from '../models/task.js'
import logger from '../logs/logger.js'
import { encriptar } from '../common/bycript.js'
import { Status } from '../constants/index.js'
import { Op } from 'sequelize';

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

const getTasks = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include: [
        {
          model: Task,
          attributes: ['name', 'done']
        }
      ],
      where: { id },
    });
    res.json(user);
  } catch (error) {
    return res.json(error.message);
  }
}

async function listWithPagination(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const orderBy = req.query.orderBy || 'id'
    const orderDir = req.query.orderDir || 'DESC'

    const validLimits = [5, 10, 15, 20]
    const finalLimit = validLimits.includes(limit) ? limit : 10

    const validOrderBy = ['id', 'username', 'status']
    const finalOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'id'

    const finalOrderDir = orderDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    const offset = (page - 1) * finalLimit

    const whereConditions = {}

    if (search) {
      whereConditions.username = {
        [Op.iLike]: `%${search}%`
      }
    }

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      where: whereConditions,
      order: [[finalOrderBy, finalOrderDir]],
      limit: finalLimit,
      offset: offset
    })

    const totalPages = Math.ceil(count / finalLimit)

    res.json({
      total: count,
      page: page,
      pages: totalPages,
      data: rows
    })

  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener usuarios',
      error: error.message 
    })
  }
}

export default {
  create,
  get,
  find,
  update,
  activeInactive,
  eliminar,
  getTasks,
  listWithPagination
}