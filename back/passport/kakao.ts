import {Strategy as KakaoStrategy} from 'passport-kakao';
import User from '../models/user';
import * as passport from 'passport';

export default () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID!,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('profile',profile);
    
    try{
      console.log('passport');
      
      const exUser = await User.findOne({
        where: {
          kakaoId: profile.id,
          provider: 'kakao'
        }
      });
      if(exUser){
        console.log('exUser',exUser);
        
         return done(null, exUser);
      } else {

      const newUser = await User.create({
        email: profile._json?.kakao_account.email,
        name: profile.displayName,
        kakaoId: profile.id,
        provider: 'kakao'
      });
        console.log('newUser',newUser);

       return done(null, newUser);
    }
    } catch(error){
      console.log('error');
      
      console.error(error);
      return done(error);
    }
  }))
}