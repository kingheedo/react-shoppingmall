import * as passport from 'passport';
import local from './local';
import User from '../models/user';
import kakao from './kakao';
import naver from './naver';

export default() => {
    passport.serializeUser((user: User, done) => {
    done(null, user.id);

  });

    passport.deserializeUser<number>(async(id, done) => {
        try{
            const user = await User.findOne({where: {id}});
            return done(null,user)
            
        }catch(error){
            console.error(error);
             return done(error);
        }
    })
    local();
    kakao();
    naver();
}