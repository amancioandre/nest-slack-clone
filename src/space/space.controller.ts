import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { SpaceService } from './space.service';
import { Space } from './space.entity';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { UpdateSpaceDTO } from './dto/update-space.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('spaces')
export class SpaceController {
    constructor(
        private readonly spaceService: SpaceService
    ) {}

    @Get()
    async findAll(): Promise<Space[]> {
        return await this.spaceService.findAll()
    }

    @Post()
    async create(@Body() createSpaceDTO: CreateSpaceDTO): Promise<Space> {
        return await this.spaceService.create(createSpaceDTO)
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Space> {
        return await this.spaceService.findOne(id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateSpaceDTO: UpdateSpaceDTO): Promise<Space> {
        return await this.spaceService.update(id, updateSpaceDTO)
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Space> {
        return await this.spaceService.remove(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/join')
    async joinSpace(@Param('id') id: string, @Req() req: { user: any }): Promise<Space> {
        return await this.spaceService.joinSpace(id, req.user.id)
    }

}
