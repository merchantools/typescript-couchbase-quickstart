import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as fs from 'fs'
import * as path from 'path'
import YAML from 'yaml'
import airlineRoutes from './routes/airline'
import airportRoutes from './routes/airport'
import routeRoutes from './routes/route'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const swaggerPath = path.resolve(__dirname, 'swagger.yaml')

try {
    const swaggerYaml = fs.readFileSync(swaggerPath, 'utf8')
    const swaggerDocument = YAML.parse(swaggerYaml)

    // @ts-ignore
    app.use('/swagger-ui', swaggerUi.serve)
    // @ts-ignore
    app.get('/swagger-ui', swaggerUi.setup(swaggerDocument, { explorer: true }))
} catch (error) {
    console.error('Error loading Swagger document:', error)
}

app.get('/', (req, res) => {
    res.send(
        '<body onload="window.location = \'/swagger-ui/\'"><a href="/swagger-ui/">Click here to see the API</a>'
    )
})

app.use('/api/v1/airline', airlineRoutes)
app.use('/api/v1/airport', airportRoutes)
app.use('/api/v1/route', routeRoutes)

app.get('*', (req, res) => {
    console.log(`Received request for: ${req.originalUrl}`)
    res.status(404).send('Not Found')
})

export { app }
