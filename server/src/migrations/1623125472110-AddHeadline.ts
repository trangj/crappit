import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHeadline1623125472110 implements MigrationInterface {
  name = 'AddHeadline1623125472110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" ADD "headline" character varying NOT NULL DEFAULT \'\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" DROP COLUMN "headline"');
  }
}
