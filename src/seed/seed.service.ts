import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  runSeed() {
    const data = this.insertNewProducts();
    if (data) return 'Seed Executed';
    return 'Seed Failed';
  }
  private async insertNewProducts() {
    await this.productsService.deleteAllProduct();
    const products = initialData.products;

    const insertPromise = [];

    products.forEach((product) => {
      insertPromise.push(this.productsService.create(product));
    });

    await Promise.all(insertPromise);

    return true;
  }
}
