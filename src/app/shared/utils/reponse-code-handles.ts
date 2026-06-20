import { IResponseSchema } from "../configs/api-config";
import { responseMessages } from "../core/constants/response-msgs.contant";


export const responseMessageHandler=(res:IResponseSchema)=>{
    const message = responseMessages.codes.find(item => item.code == res.message)?.message ?? '';
    return message
}