import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

@Injectable()
export class DatabaseSevice {
    constructor(@InjectConnection() private readonly connection: Connection) {}
    getConecction(): Connection {
        return this.connection;
    }
}
