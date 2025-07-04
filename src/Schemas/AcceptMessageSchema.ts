import {z} from 'zod'

export const AcceptMEssageSchema = z.object({
 acceptMessages: z.boolean()
})