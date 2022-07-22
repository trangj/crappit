declare namespace Express {
    interface Request {
        user: any;
        topic: any;
        moderator: any;
        file: MulterS3.File;
        session: any;
    }
}
