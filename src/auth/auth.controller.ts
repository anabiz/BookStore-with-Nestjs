import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


@Controller('auth')
export class AuthController {
    /**
     *
     */
    constructor(private authService: AuthService) {}
    
    @Post('signup')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signup(@Body() model: AuthDto){
       return this.authService.signup(model);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signin(@Body() model: AuthDto){
        return this.authService.signin(model);
    }
}