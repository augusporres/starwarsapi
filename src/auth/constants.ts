import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
    secret: process.env.JWTSECRET || 'DO NOT USER THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE'
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);