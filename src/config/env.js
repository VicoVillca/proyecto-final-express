import 'dotenv/config'

const env = {
  port: process.env.PORT || '3000',
  db_host: process.env.DB_HOST,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_database: process.env.DB_DATABASE,
  db_dialect: process.env.DB_DIALECT,
  bcrypt_salt_rounds: +process.env.BCRYPT_SALT_ROUNDS
}

export default env