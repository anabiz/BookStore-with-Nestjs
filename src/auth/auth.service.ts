import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService{
    /**
     *
     */
    constructor(
        private prismaService: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ){}

    async signup(signupDto: AuthDto){
        //hash the password
        const hash = await argon.hash(signupDto.password);

        //save the new user to db
        try{
            const user = await this.prismaService.user.create({
                data:{
                    email: signupDto.email,
                    hash
                }
            })

            //return the user information
            return this.signToken(user.id, user.email);

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
               if(error.code === "P2002"){
                   throw new ForbiddenException("Credential taken");
                }
            }
            throw error;
        }
    }

    async signin(signinDto: AuthDto){
        //find user by email
        const user = await this.prismaService.user.findUnique({
            where: {
                email: signinDto.email,
            },
        })
        //if user does not exist throw exception
        if(!user)
           throw new ForbiddenException("Credentials incorrect");

        //verify password match
        const passMatchs = await argon.verify(user.hash, signinDto.password);  
        if(!passMatchs) 
           throw new ForbiddenException("Credentials incorrect"); 

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload ={
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn:"15m",
            secret: this.config.get("JWT_SECRET"),
        })

        return {
            access_token: token,
        };
    }
}