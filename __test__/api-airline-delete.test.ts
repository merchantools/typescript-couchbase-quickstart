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

describe('DELETE /api/v1/airline/{id}', () => {
    describe('given we pass a id as request param', () => {
        beforeEach(async () => {
            const { airlineCollection } = await getDatabase()
            const airline: Airline = {
                name: 'Test Name',
                icao: 'TEST',
                country: 'Test Country',
            }
            const id = 'airline_777'

            await airlineCollection
                .insert(id, airline)
                .then(() => {
                    /*console.log('test item inserted', airline)*/
                })
                .catch((e) =>
                    console.log(`Test Airline Insert Failed: ${e.message}`)
                )
        })

        test('should respond with status code 204 Deleted', async () => {
            const id = 'airline_777'

            const response = await request(app)
                .delete(`/api/v1/airline/${id}`)
                .send()
            expect(response.statusCode).toBe(204)
        })
    })
})
