import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

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
    return true;
  }
}
