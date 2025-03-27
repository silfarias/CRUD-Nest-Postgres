import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ) { }


  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      
    });
    return products;
  }

  async findOne(term: string) {
    try {

      let product: Product | null;

      if ( isUUID(term) ) {

        product = await this.productRepository.findOneBy({ id: term });

      } else {

        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where(`UPPER(title) =:title or slug=:slug`, {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();
      }

      if ( !product ) 
        throw new NotFoundException(`Product with id ${term} not found`);

      return product;

    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`)

    try {
      await this.productRepository.save(product);
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);

      if (!product) 
        throw new NotFoundException(`Product with id ${id} not found`);

      await this.productRepository.remove(product);
    } catch (error) {
      console.log(error)
    }
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    
    console.log(error)
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
