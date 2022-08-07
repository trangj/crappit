import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIconsToNotifications1659900673438 implements MigrationInterface {
  name = 'AddIconsToNotifications1659900673438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "notification" ADD "icon_url" character varying NOT NULL DEFAULT \'\'');
    await queryRunner.query('ALTER TABLE "notification" ADD "icon_name" character varying NOT NULL DEFAULT \'\'');

    await queryRunner.query(`
        update notification n
        set icon_name = s.avatar_image_name, icon_url = s.avatar_image_url
        from "user" s, notification_type nt
        where n.sender_id = s.id and nt.id = n.notification_type_id and (nt.type_name = 'POST_REPLY' or nt.type_name = 'COMMENT_REPLY')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "notification" DROP COLUMN "icon_name"');
    await queryRunner.query('ALTER TABLE "notification" DROP COLUMN "icon_url"');
  }
}
