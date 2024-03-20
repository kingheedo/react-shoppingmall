import {Strategy as NaverStrategy} from 'passport-naver';
import * as passport from 'passport';
import { User } from '../models';

export default() => {
  passport.use(new NaverStrategy({
     clientID: process.env.NAVER_ID!,
     clientSecret: process.env.NAVER_SECRET!,
     callbackURL: '/auth/naver/callback'
  },async(accessToken, refreshToken, profile, done) => {
    try{
      console.log('profile',profile);
      const exUser = await User.findOne({
        where: {
          naverId: profile.id,
          provider: 'naver'
        }
      });
      if(exUser){
        return done(null, exUser);
      }else{
        
        
        const newUser = await User.create({
          email: profile._json?.email,
          name: profile.displayName || profile._json?.email,
          naverId: profile.id,
          provider: 'naver'
        })

        return done(null, newUser)
      }
    }
    catch(error){
      console.error(error);
      return done(error);
    }
  }))
}