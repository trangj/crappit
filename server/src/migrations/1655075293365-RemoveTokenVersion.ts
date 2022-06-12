import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTokenVersion1655075293365 implements MigrationInterface {
  name = 'RemoveTokenVersion1655075293365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "token_version"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ADD "token_version" integer NOT NULL DEFAULT \'0\'');
  }
}
