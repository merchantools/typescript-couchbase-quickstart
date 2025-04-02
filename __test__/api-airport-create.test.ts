import {
    request,
    describe,
    test,
    expect, //supertest
    getDatabase, // couchbase
    app, // REST application
} from './imports'
import { Airport } from '../src/models/airportModels'
afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

describe('POST /api/v1/airport/{id}', () => {
    describe('given a request with airport data', () => {
        const expected = { statusCode: 201, message: '' }
        const id = 'airport_777'
        const airport: Airport = {
            airportname: 'Test Name',
            city: 'Test City',
            country: 'Test Country',
            faa: 'TESTFAA',
        }
        test('should respond with statusCode 201 and return document persisted', async () => {
            const response = await request(app)
                .post(`/api/v1/airport/${id}`)
                .send(airport)
            expect(response.statusCode).toBe(expected.statusCode)
            expect(response.body).toMatchObject({
                airportname: airport.airportname,
                city: airport.city,
                country: airport.country,
                faa: airport.faa,
            })
        })

        afterEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .remove(id)
                .then(() => {
                    console.log('test airport document deleted', id)
                })
                .catch((e) =>
                    console.log(`test airport remove failed: ${e.message}`)
                )
        })
    })
})
