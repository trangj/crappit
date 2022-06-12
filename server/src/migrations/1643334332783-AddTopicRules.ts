import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTopicRules1643334332783 implements MigrationInterface {
  name = 'AddTopicRules1643334332783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" ADD "rules" jsonb NOT NULL DEFAULT \'[]\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" DROP COLUMN "rules"');
  }
}
