const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
	type: "postgres",
	entities: ["dist/entities/**/*.js"],
	migrations: ["dist/migrations/**/*.js"],
	url: process.env.DATABASE_URL,
	namingStrategy: new SnakeNamingStrategy(),
};
