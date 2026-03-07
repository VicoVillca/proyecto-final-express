import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constants/index.js";
import { Task } from "./task.js";
import { encriptar } from "../common/bycript.js";

export const User = sequelize.define('users', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre de usuario es requerido'
            },
            notEmpty: {
                msg: 'El nombre de usuario no puede estar vacío'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'LA contarseña es requerida'
            },
            notEmpty: {
                msg: 'LA contaseña no puede estar vacìa'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `El estado debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`
            }
        }
    }
})

User.hasMany(Task);
Task.belongsTo(User);

User.beforeCreate(async (user) => {
    user.password = await encriptar(user.password)
})