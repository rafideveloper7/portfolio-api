import { app } from './app.js'
import { env } from './config/env.js'

// app.listen(env.port, () => {
//   console.log(`Backend running on http://localhost:${env.port}`)
// })

// serverless deployment entry point (e.g. for Vercel)
export default app;
