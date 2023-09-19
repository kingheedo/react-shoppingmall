import * as passport from 'passport';
import local from './local';
import User from '../models/user';
import kakao from './kakao';
type IUser ={
    id?: number;
}
export default() => {
    passport.serializeUser((user:IUser, done) => {

    done(null, user.id);

  });

    passport.deserializeUser<number>(async(id, done) => {
        try{
            const user = await User.findOne({where: {id}});
            done(null,user)
            
        }catch(error){
            console.error(error);
             done(error);
        }
    })
    local();
    kakao();
}