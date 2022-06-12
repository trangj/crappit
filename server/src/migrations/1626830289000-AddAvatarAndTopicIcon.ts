import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarAndTopicIcon1626830289000 implements MigrationInterface {
  name = 'AddAvatarAndTopicIcon1626830289000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" ADD "icon_image_url" character varying NOT NULL DEFAULT \'\'');
    await queryRunner.query('ALTER TABLE "topic" ADD "icon_image_name" character varying NOT NULL DEFAULT \'\'');
    await queryRunner.query('ALTER TABLE "user" ADD "avatar_image_url" character varying NOT NULL DEFAULT \'\'');
    await queryRunner.query('ALTER TABLE "user" ADD "avatar_image_name" character varying NOT NULL DEFAULT \'\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "avatar_image_name"');
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "avatar_image_url"');
    await queryRunner.query('ALTER TABLE "topic" DROP COLUMN "icon_image_name"');
    await queryRunner.query('ALTER TABLE "topic" DROP COLUMN "icon_image_url"');
  }
}
