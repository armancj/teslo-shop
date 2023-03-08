import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

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
