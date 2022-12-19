import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  username!: string;

  @Column("text")
  firstName!: string;

  @Column("text")
  lastName!: string;

  @Column("text")
  email!: string;

  @Column("text")
  phoneNo!: string;

  @Column("text")
  password!: string;

  @Column("int", { default: 0 })
  count!: number;
}
