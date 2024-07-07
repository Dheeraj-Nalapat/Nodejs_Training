import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectingDepartmentAndEmployee1720375675389
  implements MigrationInterface
{
  name = "ConnectingDepartmentAndEmployee1720375675389";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_d62835db8c0aec1d18a5a927549"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" RENAME COLUMN "department_id" TO "department_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b" UNIQUE ("name")`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "department_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "department_name" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_ab4b655f2251cdc2acb9447a6d5" FOREIGN KEY ("department_name") REFERENCES "department"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_ab4b655f2251cdc2acb9447a6d5"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "department_name"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "department_name" integer`
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" RENAME COLUMN "department_name" TO "department_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_d62835db8c0aec1d18a5a927549" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
