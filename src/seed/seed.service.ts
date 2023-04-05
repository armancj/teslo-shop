import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTable();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed Executed';
  }

  private async deleteTable() {
    await this.productsService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    await queryBuilder.delete().execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUser = await this.userRepository.save(users);
    return dbUser[48];
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const insertPromise = [];

    products.forEach((product) => {
      insertPromise.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromise);

    return true;
  }
}
