 type UserInfo = {
    info: {
        id: number;
        email: string;
        name: string;
    };
    cartLength: number;
}

export type PostAddressReq = {
    postNum: string;
    base: string;
    detail: string;
}

export type GetAddressesRes = {
    id: number;
    postNum: string;
    base: string;
    detail: string;
}

export type GetUserRes = UserInfo

export type PostLoginReq = {
    email: string;
    password: string;
}
export type PostLoginRes = UserInfo;