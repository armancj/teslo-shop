import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    uniqueItems: true,
    type: String,
    example: '2b5e7263-6b02-4dcf-ba7c-de1540feda56',
    description: ' Product Id',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    uniqueItems: true,
    type: String,
    example: 'This is Title',
    description: ' Product Title',
    required: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    uniqueItems: true,
    type: Number,
    default: 0,
    example: 100,
    description: ' Product Price',
    required: false,
    nullable: false,
  })
  @Column('numeric', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column({ array: true, type: 'text', default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (images) => images.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }
}
