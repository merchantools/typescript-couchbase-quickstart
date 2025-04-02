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

describe('GET /api/v1/airport/{id}', () => {
    describe('given we pass a id as request param', () => {
        const id = 'airport_777'
        const airport: Airport = {
            airportname: 'Test Name',
            city: 'Test City',
            country: 'Test Country',
            faa: 'TESTFAA',
        }

        beforeEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .insert(id, airport)
                .then(() => {
                    /*console.log('test airport document inserted', airport)*/
                })
                .catch((e) =>
                    console.log(`test airport insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and return airport as object', async () => {
            const response = await request(app)
                .get(`/api/v1/airport/${id}`)
                .send()
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject(airport)
        })

        afterEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .remove(id)
                .then(() => {
                    /*console.log('test airport document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airport remove failed: ${e.message}`)
                )
        })
    })
})
