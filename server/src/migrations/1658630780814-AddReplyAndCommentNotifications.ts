import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReplyAndCommentNotifications1658630780814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          insert into notification_type (type_name , description) 
          values 
          ('POST_REPLY', 'Comments on your posts'), 
          ('COMMENT_REPLY', 'Replies to your comments')
        `);
    await queryRunner.query(`
          insert into notification_setting (user_id, notification_type_id, "value")
          select 
          u.id user_id,
          nt.id notification_type_id, 
          true "value"
          from "user" u, notification_type nt
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            delete from notification_setting 
            where notification_type_id = any (
                select id from notification_type 
                where type_name = 'POST_REPLY' or type_name = 'COMMENT_REPLY'
            )
        `);
    await queryRunner.query(`
            delete from notification_type
            where type_name = 'POST_REPLY' or type_name = 'COMMENT_REPLY'`);
  }
}
