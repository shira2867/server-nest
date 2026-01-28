

import { RoleSchema } from "../schemas/user.schema";
import { createZodDto } from "nestjs-zod";



export class UpdateRoleDto extends createZodDto(RoleSchema) {

}