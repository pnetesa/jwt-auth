import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation-exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map(
        (error) =>
          `${error.property} - ${Object.values(error.constraints).join(', ')}`,
      );
      throw new ValidationException(messages);
    }

    return value;
  }
}
