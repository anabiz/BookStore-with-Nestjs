import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    /**
     *
     */
    constructor(private prismaService: PrismaService) {}

    getBookmarks(userId: number){
        return this.prismaService.bookmark.findMany({
            where:{
                UserId: userId,
            },
        })
    }

    async createBookmark(userId: number, model: CreateBookmarkDto){
        const bookmark = await this.prismaService.bookmark.create({
            data:{
                UserId: userId,
                ...model
            }
        });

        return bookmark;
    }

    getBookmarkById(userId: number, bookmarkId: number){
        return this.prismaService.bookmark.findFirst({
            where:{
                id: bookmarkId,
                UserId: userId,
            },
        })
    }

    async editBookmarkById(userId: number, bookmarkId: number, model: EditBookmarkDto){
        await this.verifyUserResouce(bookmarkId, userId);

        return this.prismaService.bookmark.update({
            where:{
                id: bookmarkId
            },
            data:{
                ...model
            }
        })   
    }

    async deleteBookmarkById(userId: number, bookmarkId: number){
        await this.verifyUserResouce(bookmarkId, userId);

        await this.prismaService.bookmark.delete({
            where:{
                id: bookmarkId
            }
        })
    }

    private async verifyUserResouce(bookmarkId: number, userId: number) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
    
        if (!bookmark || bookmark.UserId != userId)
            throw new ForbiddenException('Access to resources denied');
    }
}


