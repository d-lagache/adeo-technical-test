import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** Paramètre de query des classements (`most-appreciated`, `lowest-rated`). */
export class LimitQueryDto {
  /** Nombre maximal de produits renvoyés. */
  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 5;
}
