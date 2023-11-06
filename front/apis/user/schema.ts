 type UserInfo = {
    info: {
        id: number;
        email: string;
        name: string;
    };
    cartLength: number;
}

export type PostAddAddressReq = {
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
}
export type PostAddAddressRes = string;

export type PatchAddressReq = PostAddAddressReq & {
    id: number;
}

export type PatchAddressRes = PostAddAddressRes

export type GetAddressesRes = {
    id: number;
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
}[];

export type GetUserRes = UserInfo

export type PostLoginReq = {
    email: string;
    password: string;
}
export type PostLoginRes = UserInfo;