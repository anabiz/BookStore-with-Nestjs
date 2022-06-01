import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    /**
     *
     */
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number,){
        return this.bookmarkService.getBookmarks(userId)
    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() model: CreateBookmarkDto){
        return this.bookmarkService.createBookmark(userId, model)
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.getBookmarkById(userId, bookmarkId)
    }

    @Patch(':id')
    editBookmarkById(@GetUser('id') userId: number,@Param('id', ParseIntPipe) bookmarkId: number, @Body() model: EditBookmarkDto){
        return this.bookmarkService.editBookmarkById(userId, bookmarkId, model)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number){
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
    }
}
