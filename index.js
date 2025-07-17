import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia() 
    .use(
        cors({
            origin: ["http://localhost:3000", "http://localhost:5173"],
            credentials: true
        })
    )
    .onRequest(({ set }) => {
        set.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    })
    .get('/', () => 'Hello World!')
      .get('/ashishjha', () => {
        return Response.redirect('https://ashishjha.tech', 302); 
    })
    
    .get('/user/:id', ({ params: { id } }) => id)
    .post('/form', ({ body }) => body)
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') return 'Route not found :('
    })
    .listen(8000);

app.handle(new Request('http://localhost/')).then(console.log)
