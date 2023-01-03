

export const OrderHeaderAttribute = ['id', 'fecha', 'total']
export const CategoryAttribute = ['id', 'nombre']
export const ClientAttribute = ['id', 'correo', 'nombre']
export const VoucherAttribute = ['id', 'nro']
export const OrderDetailAttribute = ['id', 'subtotal']
export const EmployeeAttribute = ['id', 'nombre', 'dni',]
export const TableAttribute = ['id', 'nombre',]
export const ProductAttribute = ['id', 'nombre', 'precio', 'cantidad']
export const RolAttribute = ['id', 'nombre']
export const UserAttribute = ['id']


export interface AtribbuteEntity {
    [id: string]: string[]
}
