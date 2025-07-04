import {z} from 'zod'

export const MessageSChema = z.object({
 Content: z.string().min(10 , {message: "Content Must be alreast 10 characte"}).max(300 , {message: "Content must be no longer than 300 Charactor"})
})


