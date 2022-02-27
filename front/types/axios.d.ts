export interface IHeadersDefaults {
        Cookie?:string
    }
declare module 'axios'{

    export interface HeadersDefaults extends IHeadersDefaults {}
}
