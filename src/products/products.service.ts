import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { GetAllQueryDto } from '../common/dto/get-all-query.dto';
import { Product, ProductImage } from './entities';
import { User } from "../auth/entities/user.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...productDetails } = createProductDto;
    const product = await this.productRepository.create({
      ...productDetails,
      images: images.map((image) =>
        this.productImageRepository.create({ url: image }),
      ),
      user,
    });
    await this.productRepository.save(product).catch((error) => {
      handleDBExceptions(error);
    });
    return { ...product, images };
  }

  findAll(getAllQueryDto: GetAllQueryDto) {
    return this.productRepository.find({
      take: getAllQueryDto?.take,
      skip: getAllQueryDto?.skip,
      relations: { images: true },
    });
  }

  async findOne(id: string) {
    const where = isUUID(id)
      ? { id }
      : [{ slug: id.toLowerCase() }, { title: id }];
    return await this.productRepository
      .findOneOrFail({
        where,
      })
      .catch((err) => {
        handleDBExceptions(err, `product by type matching: ${id}`);
      });
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    //return this.productRepository.update(id, updateProductDto).catch((error) => {
    //       handleDBExceptions(error);
    //     });

    const images: ProductImage[] = updateProductDto.images?.map((image) => {
      return {
        url: image,
      } as ProductImage;
    });

    const productUpdate = await this.productRepository.preload({
      id,
      ...updateProductDto,
      images,
      user,
    });
    if (!productUpdate) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.save(productUpdate).catch((error) => {
      handleDBExceptions(error);
    });
  }

  async remove(id: string) {
    return await this.productRepository.delete(id).then((result) => {
      if (result.affected === 0)
        throw new NotFoundException(`Product with id: ${id} is not found`);
      return result;
    });
  }

  async deleteAllProduct() {
    return await this.productRepository.delete({}).catch((error) => {
      handleDBExceptions(error);
    });
  }
}
