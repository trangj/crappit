import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { User } from '../entities';

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + '/api/user/google/callback',
}, async (google_access_token, _, profile, done) => {
    try {
        let user = await User.findOne({ where: [{ google_id: profile.id }, { email: profile.emails[0].value }] });

        if (user) {
            user.google_access_token = google_access_token;
            user.google_id = profile.id;
            await user.save();
        } else {
            user = await User.create({
                username: Date.now().toString(),
                email: profile.emails[0].value,
                google_id: profile.id
            }).save().catch(err => { throw Error("A user already exists with that username or email"); });
        }

        const refresh_token = jwt.sign(
            { id: user.id, token_version: user.token_version },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        done(undefined, refresh_token);
    } catch (err) {
        console.log(err);
        done(err);
    }
}));

export default passport;