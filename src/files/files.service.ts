import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticFile(fileName: string) {
    const path = join(process.cwd(), 'static/products', fileName);

    console.log(path);

    if (!existsSync(path))
      throw new BadRequestException(`No file found with filename: ${fileName}`);

    return path;
  }
}
