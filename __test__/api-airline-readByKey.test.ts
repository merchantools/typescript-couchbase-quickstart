import {
    request,
    describe,
    test,
    expect, //supertest
    getDatabase, // couchbase
    app, // REST application
} from './imports'
import { Airline } from '../src/models/airlineModels'
afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

describe('GET /api/v1/airline/{id}', () => {
    describe('given we pass a id as request param', () => {
        const id = 'airline_777'
        const airline: Airline = {
            name: 'Test Name',
            icao: 'TEST',
            country: 'Test Country',
        }

        beforeEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .insert(id, airline)
                .then(() => {
                    /*console.log('test airline document inserted', airline)*/
                })
                .catch((e) =>
                    console.log(`test airline insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and return airline as object', async () => {
            const response = await request(app)
                .get(`/api/v1/airline/${id}`)
                .send()
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject(airline)
        })

        afterEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .remove(id)
                .then(() => {
                    /*console.log('test airline document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airline remove failed: ${e.message}`)
                )
        })
    })
})
