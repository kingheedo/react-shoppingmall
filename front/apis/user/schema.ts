 type UserInfo = {
    id: number;
    email: string;
    name: string;
}

export type GetUserRes = UserInfo

export type PostLoginReq = {
    email: string;
    password: string;
}
export type PostLoginRes= UserInfo