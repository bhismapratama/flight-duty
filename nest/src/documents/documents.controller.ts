import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiFailures, ApiSuccess, SuccessResponse } from '@common';

import { DOCUMENTS_EXAMPLE } from './documents.examples.js';
import { DocumentsService } from './documents.service.js';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiSuccess('Documents retrieved', DOCUMENTS_EXAMPLE)
  @ApiFailures('/documents', [401, 'Missing access token'])
  getDocuments() {
    const result = this.documentsService.getDocuments();

    return new SuccessResponse(HttpStatus.OK, 'Documents retrieved', result);
  }
}
