import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsFilterValid( property: string, validationOptions?: ValidationOptions ) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsFilterValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          
          return (/^[0-9]{8}$/.test(value) && value === relatedValue);
        },
      },
    });
  };
}
