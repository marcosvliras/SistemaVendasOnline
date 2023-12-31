import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { InsertCartDto } from './dto/insert-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserId } from 'src/decorators/user-id.decorator';
import { ReturnCartDto } from './dto/return-cart.dto';
import { DeleteResult } from 'typeorm';
import { CartEntity } from './entities/cart.entity';

@Roles(UserType.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(
    @Body() insertCartDto: InsertCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.insertProductInCart(insertCartDto, userId),
    );
  }

  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.findCartByUserId(userId, true),
    );
  }

  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult> {
    return this.cartService.clearCart(userId);
  }

  @Delete('/product/:productId')
  async deleteProductCart(
    @Param('productId') productId: number,
    @UserId() userId: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(productId, userId);
  }

  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductInCart(
    @Body() updateCart: UpdateCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.updateProductInCart(updateCart, userId),
    );
  }
}
