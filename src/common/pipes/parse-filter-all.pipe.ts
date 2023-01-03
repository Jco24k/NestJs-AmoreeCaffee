import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';


@Injectable()
export class ParseFilterAll implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): PaginationDto {
    if (!Object.keys(value).length) return {} as PaginationDto;
    const { limit = process.env.DEFAULT_LIMIT, offset = '0', validateOrderBy = [], sordir = 'asc', orderby = 'id', estado = 'all' } = value
    const validOrderBy = ['asc', 'desc'], validEstado = ['all', 'active', 'inactive'];
    if (!this.validNum(limit + '')) throw new BadRequestException(`limit must be a positive number`)
    if (!this.validNum(offset + '', 0)) throw new BadRequestException(`offset must be a positive number`)
    if (!validOrderBy.includes(sordir)) throw new BadRequestException(`sordir must be one of the following values: [${validOrderBy}]`)
    if (!validateOrderBy.includes(orderby)) throw new BadRequestException(`orderby must be one of the following values: [${validateOrderBy}]`)
    if (!validEstado.includes(estado)) throw new BadRequestException(`orderby must be one of the following values: [${validEstado}]`)
    return { limit: +limit, offset: +offset, sordir, orderby, estado } as PaginationDto;
  }
  validNum(value: string, limit: number = 1): boolean {
    return (/[0-9]$/.test(value) && +value >= limit);
  }
}
