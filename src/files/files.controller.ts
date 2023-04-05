import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, filename } from './helpers';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Download and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServices: ConfigService,
  ) {}

  @Get(':fileName')
  getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    res.sendFile(this.filesService.getStaticFile(fileName));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      //limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename,
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('make sure that the file has been image');
    console.log(file);
    return {
      secureUrl: `${this.configServices.get('HOST_API')}/${file.filename}`,
    };
  }
}
