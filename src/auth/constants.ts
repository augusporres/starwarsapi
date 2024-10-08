import { SetMetadata } from "@nestjs/common";
import {config} from 'dotenv';
config()
export const jwtConstants = {
    secret: process.env.JWTSECRET || 'DO NOT USER THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE'
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);