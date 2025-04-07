import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'products '})
export class Product {

    @ApiProperty({ 
        example: '0d70b458-98d8-4e44-a52e-498e5239feb0',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;


    @ApiProperty({ 
        example: 0,
        description: 'Product Price',
    })
    @Column('float', { default: 0 })
    price: number


    @ApiProperty({ 
        example: 'This is a product description',
        description: 'Product Description',
        default: null
    })
    @Column({ type: 'text', nullable: true })
    description: string;
    

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;


    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0
    })
    @Column('int', { default: 0 })
    stock: number;


    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Product Sizes',
    })
    @Column('text', { array: true })
    sizes: string[];


    @ApiProperty({
        example: 'women',
        description: 'Product Gender',
    })
    @Column('text')
    gender: string;


    @ApiProperty()
    @Column({ type: 'text', array: true, default: [] })
    tags: string[];


    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User


    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }


    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
