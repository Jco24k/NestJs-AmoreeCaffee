import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { DatabaseSevice } from './database.service';

@Module({
    providers:[ DatabaseSevice],
    imports: [DatabaseProvider],
    exports: [DatabaseProvider, DatabaseSevice]
})
export class DatabaseModule { }
