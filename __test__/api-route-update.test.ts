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

describe('PUT /api/v1/route/{id}', () => {
    describe('given the route object is updated', () => {
        const id = 'route_777'
        const initialRoute: Route = {
            airline: 'Initial Test Airline',
            airlineid: 'Initial Test AirlineId',
            sourceairport: 'Initial Test Airport',
            destinationairport: 'TESTFAA',
        }
        const updatedRoute: Route = {
            airline: 'Updated Test Airline',
            airlineid: 'Updated Test AirlineId',
            sourceairport: 'Updated Test Airport',
            destinationairport: 'TESTQAA',
        }

        beforeEach(async () => {
            const { routeCollection } = await getDatabase()
            await routeCollection
                .insert(id, initialRoute)
                .then(() => {
                    /*console.log('test route document inserted', route)*/
                })
                .catch((e) =>
                    console.log(`test route insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and updated values of document returned', async () => {
            const response = await request(app)
                .put(`/api/v1/route/${id}`)
                .send(updatedRoute)
            expect(response.statusCode).toBe(200)
            expect(response.body.airline).toBe(updatedRoute.airline)
            expect(response.body.airlineid).toBe(updatedRoute.airlineid)
            expect(response.body.sourceairport).toBe(updatedRoute.sourceairport)
            expect(response.body.destinationairport).toBe(
                updatedRoute.destinationairport
            )
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
