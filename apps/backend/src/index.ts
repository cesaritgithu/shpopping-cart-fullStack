import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})


/*

MVC

/products

M - model
V - view
C - controller





*/