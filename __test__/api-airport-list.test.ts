import {
    request,
    describe,
    test,
    expect, // supertest
    getDatabase, // couchbase
    app, // REST application
} from './imports'

import { Airport } from '../src/models/airportModels'

afterAll(async () => {
    const { cluster } = await getDatabase()
    await cluster.close()
})

describe('GET /api/v1/airport/list', () => {
    describe('given country limit & offset as request params"', () => {
        const id1 = 'airport_777'
        const airport1: Airport = {
            airportname: 'Initial Test Name',
            city: 'Initial Test City',
            country: 'Test Country',
            faa: 'TESTFAA',
        }
        const id2 = 'airport_778'
        const airport2: Airport = {
            airportname: 'Updated Test Name',
            city: 'Updated Test City',
            country: 'Test Country',
            faa: 'TESTFAA',
        }

        beforeEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .insert(id1, airport1)
                .then(() => {
                    /*console.log('test airport document inserted', airport)*/
                })
                .catch((e) =>
                    console.log(`test airport1 insert failed: ${e.message}`)
                )
            await airportCollection
                .insert(id2, airport2)
                .then(() => {
                    /*console.log('test airport document inserted', airport)*/
                })
                .catch((e) =>
                    console.log(`test airport2 insert failed: ${e.message}`)
                )
        })
        test('should respond with status code 200 OK and return the documents', async () => {
            const response = await request(app)
                .get(`/api/v1/airport/list`)
                .query({
                    offset: 0,
                    limit: 15,
                    country: 'Test Country',
                })
            expect(response.statusCode).toBe(200)

            expect(response.body).toContainEqual(
                expect.objectContaining({
                    city: airport1.city,
                    country: airport1.country,
                    faa: airport1.faa,
                })
            )

            expect(response.body).toContainEqual(
                expect.objectContaining({
                    city: airport2.city,
                    country: airport2.country,
                    faa: airport2.faa,
                })
            )
        })

        afterEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .remove(id1)
                .then(() => {
                    /*console.log('test airport document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airport1 remove failed: ${e.message}`)
                )
            await airportCollection
                .remove(id2)
                .then(() => {
                    /*console.log('test airport document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airport2 remove failed: ${e.message}`)
                )
        })
    })
})
