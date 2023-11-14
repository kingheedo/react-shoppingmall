export type Address = {
    id: number;
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
 }

 type UserInfo = {
    info: {
        email: string;
        id: number;
        name: string;
        addressId?: number;
        provider: 'local' | 'kakao' | 'naver';
        naverId?: string;
        kakaoId?: string;
    };
    cartLength: number;
    address: Address
}

export type PostAddAddressReq = Omit<Address, 'id'> & {
    base: boolean;
}
export type PostAddAddressRes = string;

export type PatchAddressReq = PostAddAddressReq & {
    id: number;
}

export type PatchAddressRes = PostAddAddressRes

export type GetAddressesRes = (Address & {
    base: boolean;
})[];

export type GetUserRes = UserInfo

export type PostLoginReq = {
    email: string;
    password: string;
}
export type PostLoginRes = UserInfo;