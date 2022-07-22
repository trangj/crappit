import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveIdColumnFromModerator1658461205076 implements MigrationInterface {
    name = 'RemoveIdColumnFromModerator1658461205076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "PK_3345e49057eeabeb37a85b56953"`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "PK_f06c2cff0d627877cfc6addd39a" PRIMARY KEY ("user_id", "topic_id")`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP COLUMN "updated_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "moderator" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "moderator" DROP CONSTRAINT "PK_f06c2cff0d627877cfc6addd39a"`);
        await queryRunner.query(`ALTER TABLE "moderator" ADD CONSTRAINT "PK_3345e49057eeabeb37a85b56953" PRIMARY KEY ("user_id", "topic_id", "id")`);
    }

}
