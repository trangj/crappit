/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKarmaAndNumFollowers1629217430942 implements MigrationInterface {
  name = 'AddKarmaAndNumFollowers1629217430942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "topic" ADD "number_of_followers" integer NOT NULL DEFAULT \'0\'');
    await queryRunner.query('ALTER TABLE "user" ADD "karma" integer NOT NULL DEFAULT \'0\'');

    const users = await queryRunner.query('SELECT * FROM "user"');
    for (const user of users) {
      await queryRunner.query(`
                UPDATE "user" u
                SET karma = ((select coalesce(sum(vote), 0) from post where post.author_id = $1) + (select coalesce(sum(vote), 0) from comment where comment.author_id = $1))
                WHERE u.id = $1
            `, [user.id]);
    }

    const topics = await queryRunner.query('SELECT * FROM "topic"');
    for (const topic of topics) {
      await queryRunner.query(`
                UPDATE "topic" t
                SET number_of_followers = (select cast(count(*) as int) from follow nf where nf.topic_id = t.id)
                WHERE t.id = $1
            `, [topic.id]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP COLUMN "karma"');
    await queryRunner.query('ALTER TABLE "topic" DROP COLUMN "number_of_followers"');
  }
}
