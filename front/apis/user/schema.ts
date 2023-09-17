 type UserInfo = {
    info: {
        id: number;
        email: string;
        name: string;
    };
    cartLength: number;
}

export type GetUserRes = UserInfo

export type PostLoginReq = {
    email: string;
    password: string;
}
export type PostLoginRes = UserInfo;