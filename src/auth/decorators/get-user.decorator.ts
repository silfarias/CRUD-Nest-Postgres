import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

// ExecutionContext: es el contexto en el cual se está ejecutando la función en el momento

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new InternalServerErrorException("User not found (request)");
        }
        return (!data) ? user : user[data];
    }
)