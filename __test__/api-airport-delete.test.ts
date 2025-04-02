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

describe('DELETE /api/v1/airport/{id}', () => {
    describe('given we pass a id as request param', () => {
        beforeEach(async () => {
            const { airportCollection } = await getDatabase()
            const airport: Airport = {
                airportname: 'Test Name',
                city: 'Test City',
                country: 'Test Country',
                faa: 'TESTFAA',
            }
            const id = 'airport_777'

            await airportCollection
                .insert(id, airport)
                .then(() => {
                    /*console.log('test item inserted', airport)*/
                })
                .catch((e) =>
                    console.log(`Test airport Insert Failed: ${e.message}`)
                )
        })

        test('should respond with status code 204 Deleted', async () => {
            const id = 'airport_777'

            const response = await request(app)
                .delete(`/api/v1/airport/${id}`)
                .send()
            expect(response.statusCode).toBe(204)
        })
    })
})
