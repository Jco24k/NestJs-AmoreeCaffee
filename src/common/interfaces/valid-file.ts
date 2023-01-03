export enum validFile{
    ANY = 'jpg|jpeg|png|gif|pdf|docx|doc|xlsx|xls',
    IMAGES = 'jpg|jpeg|png',
    DOCS = 'pdf|docx|doc|xlsx|xls',
}

export enum validPathImage{
    products = 'products',
    categories = 'categories'
}

export enum maxSizeFile{
    products = +process.env.MAX_FILE_SIZE|5,
    categories = +process.env.MAX_FILE_SIZE|5
}