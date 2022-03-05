export interface IParsedUrlQuery{
    id? :string
}
declare module 'querystring' {
    export interface ParsedUrlQuery extends IParsedUrlQuery {}
}
