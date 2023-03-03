import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { isUUID } from 'class-validator';
import { GetAllQueryDto } from '../common/dto/get-all-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto);
    return await this.productRepository.save(product).catch((error) => {
      handleDBExceptions(error);
    });
  }

  findAll(getAllQueryDto: GetAllQueryDto) {
    return this.productRepository.find({
      take: getAllQueryDto.take,
      skip: getAllQueryDto.skip,
    });
  }

  async findOne(id: string) {
    const where = isUUID(id) ? { id } : [{ slug: id }, { title: id }];
    return await this.productRepository
      .findOneOrFail({
        where,
      })
      .catch((err) => {
        handleDBExceptions(err, `product by type matching: ${id}`);
      });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    return await this.productRepository.delete(id).then((result) => {
      if (result.affected === 0)
        throw new NotFoundException(`Product with id: ${id} is not found`);
      return result;
    });
  }
}
