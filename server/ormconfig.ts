import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import express from 'express';

export default {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ["./src/entities/**/*.ts"],
    migrations: ["./src/migration/**/*.ts"],
    namingStrategy: new SnakeNamingStrategy()
};