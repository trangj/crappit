export default {
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  type: 'postgresql',
  clientUrl: 'postgres://postgres:123456@localhost:5432/crappit',
  debug: true,

};