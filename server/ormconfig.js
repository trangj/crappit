module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['dist/migrations/**/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
};
