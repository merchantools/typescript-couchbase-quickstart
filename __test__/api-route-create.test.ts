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

describe('POST /api/v1/route/{id}', () => {
    describe('given a request with route data', () => {
        const expected = { statusCode: 201, message: '' }
        const id = 'route_777'
        test('should respond with statusCode 201 and return document persisted', async () => {
            const route: Route = {
                airline: 'Test Airline',
                airlineid: 'Test AirlineId',
                sourceairport: 'Test Airport',
                destinationairport: 'TESTFAA',
            }
            const response = await request(app)
                .post(`/api/v1/route/${id}`)
                .send(route)

            expect(response.statusCode).toBe(expected.statusCode)
            expect(response.body).toMatchObject({
                airline: route.airline,
                airlineid: route.airlineid,
                sourceairport: route.sourceairport,
                destinationairport: route.destinationairport,
            })
        })

        afterEach(async () => {
            const { routeCollection } = await getDatabase()
            await routeCollection
                .remove(id)
                .then(() => {
                    console.log('test route document deleted', id)
                })
                .catch((e) =>
                    console.log(`test route remove failed: ${e.message}`)
                )
        })
    })
})
