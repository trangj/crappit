import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export default {
  "type": "postgres",
  "host": "localhost",
  "port": "5432",
  "username": "postgres",
  "password": "123456",
  "database": "crappit",
  "entities": ["./src/entities/**/*.ts"],
  "migrations": ["./src/migration/**/*.ts"],
  "logging": true,
  "namingStrategy": new SnakeNamingStrategy()
}