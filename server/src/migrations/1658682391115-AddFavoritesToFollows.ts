import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavoritesToFollows1658682391115 implements MigrationInterface {
    name = 'AddFavoritesToFollows1658682391115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_3355602e2e8c942ad21a9985a06"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28"`);
        await queryRunner.query(`ALTER TABLE "follow" ADD "favorite" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_3355602e2e8c942ad21a9985a06" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_3355602e2e8c942ad21a9985a06"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "favorite"`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_3355602e2e8c942ad21a9985a06" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
