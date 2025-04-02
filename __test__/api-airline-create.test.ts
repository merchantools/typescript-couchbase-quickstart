import {
    request,
    describe,
    test,
    expect, // supertest
    getDatabase, // couchbase
    app, // REST application
} from './imports'

import { Airline } from '../src/models/airlineModels'

afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

describe('POST /api/v1/airline/{id}', () => {
    describe('given a request with airline data', () => {
        const expected = { statusCode: 201, message: '' }
        let id: string

        test('should respond with statusCode 201 and return document persisted', async () => {
            const airline: Airline = {
                name: 'Test Name',
                icao: 'TEST',
                callsign: 'TEST-AIR',
                country: 'Test Country',
            }

            id = 'airline_777'
            const response = await request(app)
                .post(`/api/v1/airline/${id}`)
                .send(airline)

            expect(response.statusCode).toBe(expected.statusCode)
            expect(response.body).toMatchObject({
                name: airline.name,
                icao: airline.icao,
                country: airline.country,
            })
        })

        afterEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .remove(id)
                .then(() => {
                    console.log('test airline document deleted', id)
                })
                .catch((e) =>
                    console.log(`test airline remove failed: ${e.message}`)
                )
        })
    })
})
