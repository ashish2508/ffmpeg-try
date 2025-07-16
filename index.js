import {Elysia} from 'elysia'
import { cors } from '@elysiajs/cors'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

new Elysia()
    .get('/', 'Hello world')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .use(cors({
    
  })) 
    .listen(8000)

