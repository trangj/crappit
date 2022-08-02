import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import AppDataSource from '../dataSource';
import { User } from '../entities';

passport.use(new Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/api/user/google/callback`,
}, async (google_access_token, _, profile, done) => {
  try {
    let user = await AppDataSource.manager.findOne(
      User,
      { where: [{ google_id: profile.id }, { email: profile.emails[0].value }] },
    );

    if (user) {
      user.google_access_token = google_access_token;
      user.google_id = profile.id;
      await user.save();
    } else {
      user = User.create({
        username: Date.now().toString(),
        email: profile.emails[0].value,
        google_id: profile.id,
      });
      await AppDataSource.transaction(async (em) => {
        user = await em.save(user);
        await em.query(`
          insert into notification_setting (user_id, notification_type_id, "value")
          select 
          u.id user_id,
          nt.id notification_type_id, 
          true "value"
          from "user" u, notification_type nt
          where u.id = $1
      `, [user.id]);
      });
    }

    done(undefined, { id: user.id });
  } catch (err) {
    done(err);
  }
}));

export default passport;
