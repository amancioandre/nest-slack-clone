import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SpaceService } from './space.service';
import { Space } from './space.entity';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { UpdateSpaceDTO } from './dto/update-space.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateRoomDTO } from './dto/create-room.dto';

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
    @Post(':id/rooms')
    async addRoom(@Param('id') id: string, @Body() createRoomDTO: CreateRoomDTO): Promise<Space> {
        return await this.spaceService.addRoom(id, createRoomDTO)
    }

}
