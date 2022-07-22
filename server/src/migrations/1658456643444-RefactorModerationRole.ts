import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorModerationRole1658456643444 implements MigrationInterface {
    name = 'RefactorModerationRole1658456643444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "FK_66fbb62ddac20bf14313153c250"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "FK_abed9986d2c388c958bc655a3db"`);
        await queryRunner.query(`DROP INDEX "IDX_66fbb62ddac20bf14313153c25"`);
        await queryRunner.query(`DROP INDEX "IDX_abed9986d2c388c958bc655a3d"`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "PK_f06c2cff0d627877cfc6addd39a"`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "PK_3345e49057eeabeb37a85b56953" PRIMARY KEY ("user_id", "topic_id", "id")`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "can_manage_posts_and_comments" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "can_manage_settings" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "can_manage_everything" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "FK_66fbb62ddac20bf14313153c250" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "FK_abed9986d2c388c958bc655a3db" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "FK_abed9986d2c388c958bc655a3db"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "FK_66fbb62ddac20bf14313153c250"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "can_manage_everything"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "can_manage_settings"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "can_manage_posts_and_comments"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "PK_3345e49057eeabeb37a85b56953"`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "PK_f06c2cff0d627877cfc6addd39a" PRIMARY KEY ("user_id", "topic_id")`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "id"`);
        await queryRunner.query(`CREATE INDEX "IDX_abed9986d2c388c958bc655a3d" ON "moderator" ("topic_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_66fbb62ddac20bf14313153c25" ON "moderator" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "FK_abed9986d2c388c958bc655a3db" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "FK_66fbb62ddac20bf14313153c250" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
