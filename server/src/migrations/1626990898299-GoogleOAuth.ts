import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleOAuth1626990898299 implements MigrationInterface {
  name = 'GoogleOAuth1626990898299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ADD "google_id" character varying');
    await queryRunner.query('ALTER TABLE "user" ADD "google_access_token" character varying');
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "google_access_token"');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "google_id"');
  }
}
