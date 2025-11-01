export default () => ({
    port: parseInt(process.env.PORT!, 10) || 3000,
    storage: {
        uploadPath: process.env.UPLOAD_PATH || './uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE!,10) || 10485760,
    },
    database: {
        type: 'sqlite',
        database: process.env.DATABASE_PATH || 'filedb.sqlite',
        syncronize: true,
        logging: false,
    },
});