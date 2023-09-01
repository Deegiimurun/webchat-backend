import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Chat } from './chat';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  isOnline: boolean = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Chat, (chat) => chat.id)
  cart: Chat[];

  @BeforeInsert()
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
