import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { number } from "joi";
import path from "path";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CurrentPathInterface } from "src/common/interfaces/current-path.interface";
import { AtribbuteEntity, CategoryAttribute, ClientAttribute, EmployeeAttribute, OrderDetailAttribute, OrderHeaderAttribute, ProductAttribute, RolAttribute, TableAttribute, UserAttribute, VoucherAttribute } from "src/common/interfaces/filterPaginationEntitys";


export const FilterPagination = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const query = req.query;
        const { path } = req.route;
        const currentPath: string = path
            .toString()
            .replaceAll(' ', '')
            .split('/').filter((x: string) => x.length)[1]
        // console.log(Object.keys(PaginationDto.arguments))
        if (!Object.keys(query).length) return {};
        const attributePagination = ['limit', 'offset', 'orderby', 'sordir','estado'];
        const atributeQuery: string[] = Object.keys(query)
        for (const atb of atributeQuery) {
            if (!attributePagination.includes(atb)) throw new BadRequestException(`property '${atb}' should not exist`)
        }
        return { ...query, validateOrderBy: cargarEntity()[currentPath] }
    }
);

const cargarEntity = () => {
    const entitiesFilter: AtribbuteEntity = {}
    const pathFilter: string[] = [
        CurrentPathInterface.cabeceraPedido, CurrentPathInterface.categoria, CurrentPathInterface.cliente,
        CurrentPathInterface.comprobamte, CurrentPathInterface.detallePedido, CurrentPathInterface.empleado
        , CurrentPathInterface.mesa, CurrentPathInterface.producto, CurrentPathInterface.rol, CurrentPathInterface.user
    ]
    const atrtibuteFilter = [
        OrderHeaderAttribute, CategoryAttribute, ClientAttribute,
        VoucherAttribute, OrderDetailAttribute, EmployeeAttribute,
        TableAttribute, ProductAttribute, RolAttribute, UserAttribute
    ]

    pathFilter.forEach((path, index) => {
        entitiesFilter[path] = atrtibuteFilter[index]
    });
    return entitiesFilter;

}