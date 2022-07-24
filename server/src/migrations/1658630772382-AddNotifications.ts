import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNotifications1658630772382 implements MigrationInterface {
    name = 'AddNotifications1658630772382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "recipient_id" integer NOT NULL, "sender_id" integer NOT NULL, "notification_type_id" integer NOT NULL, "post_id" integer, "comment_id" integer, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "read_at" TIMESTAMP, "body" character varying NOT NULL, "title" character varying NOT NULL, "url" character varying, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_setting" ("user_id" integer NOT NULL, "notification_type_id" integer NOT NULL, "value" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_fdd111f7ff070793544114052db" PRIMARY KEY ("user_id", "notification_type_id"))`);
        await queryRunner.query(`CREATE TABLE "notification_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_f9f72fbaa3734ef4beed3c3ef1b" UNIQUE ("type_name"), CONSTRAINT "PK_3e0e1fa68c25d84f808ca11dbaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_9830357f52360a126737d498e66" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_4c87b82a5cef04202495f67663c" FOREIGN KEY ("notification_type_id") REFERENCES "notification_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_3ee113bf568b5efdc29cd95a360" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_8c115126cd4fdf58819e97a9716" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_setting" ADD CONSTRAINT "FK_d210b9143572b7e8179c15f5f2a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_setting" ADD CONSTRAINT "FK_020f062c695549acff80cf23da0" FOREIGN KEY ("notification_type_id") REFERENCES "notification_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_setting" DROP CONSTRAINT "FK_020f062c695549acff80cf23da0"`);
        await queryRunner.query(`ALTER TABLE "notification_setting" DROP CONSTRAINT "FK_d210b9143572b7e8179c15f5f2a"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_8c115126cd4fdf58819e97a9716"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_3ee113bf568b5efdc29cd95a360"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_4c87b82a5cef04202495f67663c"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_9830357f52360a126737d498e66"`);
        await queryRunner.query(`DROP TABLE "notification_type"`);
        await queryRunner.query(`DROP TABLE "notification_setting"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
