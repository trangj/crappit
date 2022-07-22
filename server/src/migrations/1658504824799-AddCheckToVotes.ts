import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCheckToVotes1658504824799 implements MigrationInterface {
    name = 'AddCheckToVotes1658504824799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "CHK_8e801e4745f429023db0cad63a" CHECK ("value" >= -1 AND "value" <= 1)`);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "CHK_9255923ccf19fe2ebca287f5a3" CHECK ("value" >= -1 AND "value" <= 1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "CHK_9255923ccf19fe2ebca287f5a3"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "CHK_8e801e4745f429023db0cad63a"`);
    }

}
