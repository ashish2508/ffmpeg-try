import { cors } from '@elysiajs/cors';
import serveStatic from '@elysiajs/static'
import { exec } from "child_process";
import { Elysia, t } from 'elysia';
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_URL = '/uploads';
const UPLOADS_DIR = './uploads';
const COURSES_DIR = `${UPLOADS_DIR}/courses`;

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      credentials: true
    })
  )
  .get('/', () => 'Hello World!')
  .get('/ashishjha', () =>
    new Response('', {
      status: 302,
      headers: { Location: 'https://ashishjha.tech' }
    })
  )
  .get('/user/:id', ({ params }) => params.id)
  .post('/form', ({ body }) => body, { type: 'urlencoded' })
  .use(
    serveStatic({
      prefix: UPLOADS_URL,
      assets: UPLOADS_DIR
    })
  )
  .post(
    "/upload",
    async ({ body, set }) => {
      const file = body.file;
      const extension = path.extname(file.name);
      const lessonId = uuidv4();

      const originVideoPath = `${UPLOADS_DIR}/${lessonId}${extension}`;

      const outputDir = `${COURSES_DIR}/${lessonId}`;
      const hlsPath = `${outputDir}/index.m3u8`;

      const fs = await import("fs/promises");
      await fs.mkdir(outputDir, { recursive: true });
 
      // Write the uploaded video file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(originVideoPath, buffer);
      console.log(`File uploaded: ${originVideoPath}`);

      const ffmpegCommand = `ffmpeg -i "${originVideoPath}" -codec:v libx264 -profile:v baseline -level 3.0 -maxrate 1500k -bufsize 3000k -preset fast -b:v 1200k -codec:a aac -ac 2 -ar 48000 -b:a 128k -hls_time 2 -g 48 -keyint_min 48 -hls_playlist_type vod -hls_segment_filename "${outputDir}/segment%03d.ts" -start_number 0 "${hlsPath}"`;

//just trying not really for deployment 
      function execAsync(cmd) {
        return new Promise((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
            if (stdout) console.log('FFmpeg stdout:', stdout);
            if (stderr) console.log('FFmpeg stderr:', stderr);
            if (error) {
              console.log('FFmpeg error:', error);
              reject(error);
            }
            else {
              console.log('FFmpeg done.');
              resolve();
            }
          });
        });
      }

      try {
        await execAsync(ffmpegCommand);
        await fs.unlink(originVideoPath);
        const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;
        return {
          success: true,
          lessonId: lessonId,
          url: videoUrl
        };
      } catch (error) {
        set.status = 500;
        return { success: false, error: 'FFmpeg failed', details: String(error) };
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      type: "formdata",
    }
  )
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') return 'Route not found :(';
  })
  .listen(8000);

console.log('listening on http://localhost:8000');
