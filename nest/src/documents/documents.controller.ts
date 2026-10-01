import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from '@common';

import { DocumentsService } from './documents.service.js';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  getDocuments() {
    const result = this.documentsService.getDocuments();

    return new SuccessResponse(HttpStatus.OK, 'Documents retrieved', result);
  }
}
