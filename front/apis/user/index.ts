import request from "../request"
import { GetUserRes, PostLoginReq, PostLoginRes } from "./schema";

export const logIn = async(data: PostLoginReq) => {
    return await request.post<PostLoginRes>('/user/login', data).then(res => res.data);
}

export const getUser = async() => {
    return await request.get<GetUserRes>('/user').then(res => res.data);
}

export const logout = async() => {
    return await request.post('/user/logout').then((res) => res.data);
}

export default {
    logIn,
    getUser,
    logout
}