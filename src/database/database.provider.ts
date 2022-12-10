import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";


export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get<Number>('DB_PORT'),
        database: config.get('DB_NAME'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
    }),
    inject: [ConfigService]
})