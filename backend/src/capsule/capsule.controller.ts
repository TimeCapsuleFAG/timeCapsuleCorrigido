import { User } from 'src/entities/user.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CapsuleService } from './capsule.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { UpdateCapsuleDto } from './dto/update-capsule.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import * as path from 'path';

@Controller('capsule')
@UseGuards(AuthGuard)
export class CapsuleController {
  constructor(private readonly capsuleService: CapsuleService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }))
  async create(
    @Body() createCapsuleDto: CreateCapsuleDto,
    @UploadedFiles() files: any[],
    @Req() req: any
  ) {
    let imagem: string | undefined;
    let audio: string | undefined;
    if (files && files.length) {
      for (const file of files) {
        if (file.mimetype && file.mimetype.startsWith('image/')) imagem = file.filename;
        if (file.mimetype && file.mimetype.startsWith('audio/')) audio = file.filename;
      }
    }
    // Pega o userId do JWT
    const userId = req.user?.sub;
    return this.capsuleService.create({ ...createCapsuleDto, imagem, audio }, userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.sub;
    return this.capsuleService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return this.capsuleService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapsuleDto: UpdateCapsuleDto) {
    return this.capsuleService.update(+id, updateCapsuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capsuleService.remove(+id);
  }
}
