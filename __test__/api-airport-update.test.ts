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

describe('PUT /api/v1/airport/{id}', () => {
    describe('given the airport object is updated', () => {
        const id = 'airport_777'
        const initialAirport: Airport = {
            airportname: 'Initial Test Name',
            city: 'Initial Test City',
            country: 'Initial Test Country',
            faa: 'TESTFAA',
        }
        const updatedAirport: Airport = {
            airportname: 'Updated Test Name',
            city: 'Updated Test City',
            country: 'Updated Test Country',
            faa: 'TESTFAA',
        }

        beforeEach(async () => {
            const { airportCollection } = await getDatabase()
            await airportCollection
                .insert(id, initialAirport)
                .then(() => {
                    /*console.log('test airport document inserted', airport)*/
                })
                .catch((e) =>
                    console.log(`test airport insert failed: ${e.message}`)
                )
        })

        test('should respond with status code 200 OK and updated values of document returned', async () => {
            const response = await request(app)
                .put(`/api/v1/airport/${id}`)
                .send(updatedAirport)
            expect(response.statusCode).toBe(200)
            expect(response.body.airportname).toBe(updatedAirport.airportname)
            expect(response.body.city).toBe(updatedAirport.city)
            expect(response.body.country).toBe(updatedAirport.country)
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
