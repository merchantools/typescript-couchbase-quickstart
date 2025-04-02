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

describe('GET /api/v1/airline/list', () => {
    describe('given country limit & offset as request params"', () => {
        let id1: string = 'airline_777'
        const airline1: Airline = {
            name: 'Initial Test Name',
            icao: 'INITIALTEST',
            country: 'Test Country',
        }
        let id2: string = 'airline_778'
        const airline2: Airline = {
            name: 'Update Test Name',
            icao: 'UPDATETEST',
            country: 'Test Country',
        }

        beforeEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .insert(id1, airline1)
                .then(() => {
                    /*console.log('test airline document inserted', airline)*/
                })
                .catch((e) =>
                    console.log(`test airline1 insert failed: ${e.message}`)
                )
            await airlineCollection
                .insert(id2, airline2)
                .then(() => {
                    /*console.log('test airline document inserted', airline)*/
                })
                .catch((e) =>
                    console.log(`test airline2 insert failed: ${e.message}`)
                )
        })
        test('should respond with status code 200 OK and return the documents', async () => {
            const response = await request(app)
                .get(`/api/v1/airline/list`)
                .query({
                    offset: 0,
                    limit: 5,
                    country: 'Test Country',
                })
            expect(response.statusCode).toBe(200)
            expect(response.body).toContainEqual(
                expect.objectContaining({
                    name: airline1.name,
                    icao: airline1.icao,
                    country: airline1.country,
                })
            )

            expect(response.body).toContainEqual(
                expect.objectContaining({
                    name: airline2.name,
                    icao: airline2.icao,
                    country: airline2.country,
                })
            )
        })

        afterEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .remove(id1)
                .then(() => {
                    /*console.log('test airline document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airline1 remove failed: ${e.message}`)
                )
            await airlineCollection
                .remove(id2)
                .then(() => {
                    /*console.log('test airline document deleted', id)*/
                })
                .catch((e) =>
                    console.log(`test airline2 remove failed: ${e.message}`)
                )
        })
    })
})
