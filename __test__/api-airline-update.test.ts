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

describe('PUT /api/v1/airline/{id}', () => {
    describe('given the airline object is updated', () => {
        const id = 'airline_777'
        const initialAirline: Airline = {
            name: 'Initial Test Name',
            icao: 'INITIALTEST',
            callsign: 'TEST-AIR',
            country: 'Initial Test Country',
        }
        const updatedAirline: Airline = {
            name: 'Update Test Name',
            icao: 'UPDATETEST',
            callsign: 'UTEST-AIR',
            country: 'Update Test Country',
        }

        beforeEach(async () => {
            const { airlineCollection } = await getDatabase()
            await airlineCollection
                .insert(id, initialAirline)
                .then(() => {
                    /*console.log('test airline document inserted', airline)*/
                })
                .catch((e) =>
                    console.log(`test airline insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and updated values of document returned', async () => {
            const response = await request(app)
                .put(`/api/v1/airline/${id}`)
                .send(updatedAirline)
            expect(response.statusCode).toBe(200)
            expect(response.body.name).toBe(updatedAirline.name)
            expect(response.body.icao).toBe(updatedAirline.icao)
            expect(response.body.country).toBe(updatedAirline.country)
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
