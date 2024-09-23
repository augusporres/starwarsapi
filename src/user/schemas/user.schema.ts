// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Types } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;

// @Schema()
// export class User {
//     readonly _id: Types.ObjectId;
//     @Prop()
//     username: string;
//     @Prop()
//     password: string;
//     @Prop({type: [String], default: []}) // array of strings for roles
//     roles: string[]
// }
// export const UserSchema = SchemaFactory.createForClass(User);