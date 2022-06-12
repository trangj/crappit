declare namespace Express {
    interface Request {
        user: any;
        file: MulterS3.File;
        session: any;
    }
}
