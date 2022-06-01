import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    /**
     *
     */
    constructor(private userService: UserService) {}
    
    @Get()
    getUser(@GetUser() user: User, @GetUser('email') email: string){
        console.log(email);
        return user
    }
    
    @Patch()
    editUser(@GetUser('id') id: number, @Body() model: EditUserDto){
        return this.userService.editUser(id, model);
    }

}
