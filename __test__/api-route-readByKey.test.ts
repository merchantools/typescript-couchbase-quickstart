import {
    request,
    describe,
    test,
    expect, //supertest
    getDatabase, // couchbase
    app, // REST application
} from './imports'
import { Route } from '../src/models/routeModels'
afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

describe('GET /api/v1/route/{id}', () => {
    describe('given we pass a id as request param', () => {
        const id = 'route_777'
        const route: Route = {
            airline: 'Test Airline',
            airlineid: 'Test AirlineId',
            sourceairport: 'Test Airport',
            destinationairport: 'TESTFAA',
        }

        beforeEach(async () => {
            const { routeCollection } = await getDatabase()
            await routeCollection
                .insert(id, route)
                .then(() => {
                    /*console.log('test route document inserted', route)*/
                })
                .catch((e) =>
                    console.log(`test route insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and return route as object', async () => {
            const response = await request(app)
                .get(`/api/v1/route/${id}`)
                .send()
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject(route)
        })

        afterEach(async () => {
            const { routeCollection } = await getDatabase()
            await routeCollection
                .remove(id)
                .then(() => {
                    /*console.log('test route document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test route remove failed: ${e.message}`)
                )
        })
    })
})
