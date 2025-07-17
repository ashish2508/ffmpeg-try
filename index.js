import {Elysia} from 'elysia'
import { cors } from '@elysiajs/cors'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

new Elysia()
    .get('/', () => 'Hello world')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    	.use(
		cors({
			origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true
		})
	)
.use((ctx,next))=>{

  }
    
  )) 
    .listen(8000)

