import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1622998344140 implements MigrationInterface {
  name = 'Initial1622998344140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "post_type_enum" AS ENUM(\'text\', \'link\', \'photo\')');
    await queryRunner.query('CREATE TABLE "post" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "type" "post_type_enum" NOT NULL, "content" text NOT NULL, "image_url" character varying NOT NULL, "image_name" character varying NOT NULL, "vote" integer NOT NULL DEFAULT \'0\', "number_of_comments" integer NOT NULL DEFAULT \'0\', "author_id" integer, "topic_id" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "topic" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" text NOT NULL, "image_url" character varying NOT NULL, "image_name" character varying NOT NULL, CONSTRAINT "UQ_6c4bad810323eb8e3713871b632" UNIQUE ("title"), CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "reset_password_token" character varying, "reset_password_expires" bigint, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "vote" ("user_id" integer NOT NULL, "post_id" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_e659e04d059de44c9cef512d0bd" PRIMARY KEY ("user_id", "post_id"))');
    await queryRunner.query('CREATE TABLE "comment_vote" ("user_id" integer NOT NULL, "comment_id" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_c8242fe6381984e5c4ee38dbac3" PRIMARY KEY ("user_id", "comment_id"))');
    await queryRunner.query('CREATE TABLE "comment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" text, "vote" integer NOT NULL DEFAULT \'0\', "parent_comment_id" integer, "is_edited" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "author_id" integer, "post_id" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "follow" ("user_id" integer NOT NULL, "topic_id" integer NOT NULL, CONSTRAINT "PK_681ef79f46f24ba675ffe475e36" PRIMARY KEY ("user_id", "topic_id"))');
    await queryRunner.query('CREATE INDEX "IDX_d3b514cd26ff6190a8f836f9b2" ON "follow" ("user_id") ');
    await queryRunner.query('CREATE INDEX "IDX_3355602e2e8c942ad21a9985a0" ON "follow" ("topic_id") ');
    await queryRunner.query('CREATE TABLE "moderator" ("user_id" integer NOT NULL, "topic_id" integer NOT NULL, CONSTRAINT "PK_f06c2cff0d627877cfc6addd39a" PRIMARY KEY ("user_id", "topic_id"))');
    await queryRunner.query('CREATE INDEX "IDX_66fbb62ddac20bf14313153c25" ON "moderator" ("user_id") ');
    await queryRunner.query('CREATE INDEX "IDX_abed9986d2c388c958bc655a3d" ON "moderator" ("topic_id") ');
    await queryRunner.query('ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "post" ADD CONSTRAINT "FK_dbed4484f147c92b69f920db9d6" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "vote" ADD CONSTRAINT "FK_af8728cf605f1988d2007d094f5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "vote" ADD CONSTRAINT "FK_b7f5b42bfe9b12e0cf1de3290e4" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_9c36d01ce1ba4ca9570b3d2d1b1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_4118e9566b4eeb589c599256c39" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_ac69bddf8202b7c0752d9dc8f32" FOREIGN KEY ("parent_comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "follow" ADD CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "follow" ADD CONSTRAINT "FK_3355602e2e8c942ad21a9985a06" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "moderator" ADD CONSTRAINT "FK_66fbb62ddac20bf14313153c250" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE "moderator" ADD CONSTRAINT "FK_abed9986d2c388c958bc655a3db" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "moderator" DROP CONSTRAINT "FK_abed9986d2c388c958bc655a3db"');
    await queryRunner.query('ALTER TABLE "moderator" DROP CONSTRAINT "FK_66fbb62ddac20bf14313153c250"');
    await queryRunner.query('ALTER TABLE "follow" DROP CONSTRAINT "FK_3355602e2e8c942ad21a9985a06"');
    await queryRunner.query('ALTER TABLE "follow" DROP CONSTRAINT "FK_d3b514cd26ff6190a8f836f9b28"');
    await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_ac69bddf8202b7c0752d9dc8f32"');
    await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"');
    await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"');
    await queryRunner.query('ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_4118e9566b4eeb589c599256c39"');
    await queryRunner.query('ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_9c36d01ce1ba4ca9570b3d2d1b1"');
    await queryRunner.query('ALTER TABLE "vote" DROP CONSTRAINT "FK_b7f5b42bfe9b12e0cf1de3290e4"');
    await queryRunner.query('ALTER TABLE "vote" DROP CONSTRAINT "FK_af8728cf605f1988d2007d094f5"');
    await queryRunner.query('ALTER TABLE "post" DROP CONSTRAINT "FK_dbed4484f147c92b69f920db9d6"');
    await queryRunner.query('ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"');
    await queryRunner.query('DROP INDEX "IDX_abed9986d2c388c958bc655a3d"');
    await queryRunner.query('DROP INDEX "IDX_66fbb62ddac20bf14313153c25"');
    await queryRunner.query('DROP TABLE "moderator"');
    await queryRunner.query('DROP INDEX "IDX_3355602e2e8c942ad21a9985a0"');
    await queryRunner.query('DROP INDEX "IDX_d3b514cd26ff6190a8f836f9b2"');
    await queryRunner.query('DROP TABLE "follow"');
    await queryRunner.query('DROP TABLE "comment"');
    await queryRunner.query('DROP TABLE "comment_vote"');
    await queryRunner.query('DROP TABLE "vote"');
    await queryRunner.query('DROP TABLE "user"');
    await queryRunner.query('DROP TABLE "topic"');
    await queryRunner.query('DROP TABLE "post"');
    await queryRunner.query('DROP TYPE "post_type_enum"');
  }
}
