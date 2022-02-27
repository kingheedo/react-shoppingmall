
declare module "passport-local" {
    import { Request } from 'express';
    import { Strategy as PassportStrategy } from 'passport';
    export interface IStrategyOptions{
        usernameField: string;
        passwordField: string;
        session?:boolean;
        passReqToCallback?: false;
    }
    export interface IStrategyOptionsWithRequest{
        usernameField: string;
        passwordField: string;
        session?:boolean;
        passReqToCallback: true;
    }
    export interface IVerifyOptions{
        [ket:string] : string
    }
    export interface Done{
        (error:Error | null | unknown, user?: any, options?: IVerifyOptions):void 
    }
    export  interface VerifyFunction{
        (email:string, password:string, done:Done): void | Promise<any>;
    }
    export  interface VerifyFunctionWithRequest{
        (req: Request, email:string, password:string, done:Done): void | Promise<any>;
    }
    export class Strategy extends PassportStrategy{
        constructor(options: IStrategyOptions, verify: VerifyFunction)
        constructor(options: IStrategyOptionsWithRequest, verify: VerifyFunctionWithRequest)
    }
}