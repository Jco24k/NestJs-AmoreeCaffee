

export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    dbhost: process.env.DB_HOST,
    dbusername: process.env.DB_USERNAME,
    dbpassword: process.env.DB_PASSWORD,
    dbport: process.env.DB_PORT || 3306,
    dbname: process.env.DB_NAME,
    jwtsecret: process.env.JWT_SECRET,
    uploadlocation: process.env.UPLOAD_LOCATION || './public/productos',
    port: process.env.PORT || 3002,
    defaultlimit: +process.env.DEFAULT_LIMIT || 10 ,
    max_file_size: +process.env.MAX_FILE_SIZE ||5,
    max_file_counts: +process.env.MAX_FILE_COUNTS || 5,
})
// ()=({}) //UNA FUNCION QUE RETORNA UN OBJETO 