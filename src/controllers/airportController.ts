import { Airport } from '../models/airportModels'
import { Request, Response } from 'express'
import { makeResponse } from '../shared/makeResponse'
import { getDatabase } from '../../db/connection'
import { GetResult, QueryResult } from 'couchbase'

const createAirport = async (req: Request, res: Response) => {
    let newairport: Airport = {
        ...req.body,
    }
    const { airportCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airportCollection.insert(req.params.id, newairport)
        res.status(201)
        return newairport
    })
}

const getAirport = async (req: Request, res: Response) => {
    let newairport: Airport
    const { airportCollection } = await getDatabase()
    await makeResponse(res, async () => {
        const getResult: GetResult = await airportCollection.get(req.params.id)
        newairport = getResult['content']
        return newairport
    })
}

const updateAirport = async (req: Request, res: Response) => {
    let newairport: Airport = {
        ...req.body,
    }
    const { airportCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airportCollection.upsert(req.params.id, newairport)
        return newairport
    })
}

const deleteAirport = async (req: Request, res: Response) => {
    const { airportCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airportCollection.remove(req.params.id)
        res.status(204)
        return
    })
}

const listAirport = async (req: Request, res: Response) => {
    console.log('listAirport')
    const { scope } = await getDatabase()
    // Fetching parameters
    const country = (req.query.country as string) ?? ''
    let limit = parseInt(req.query.limit as string, 10) || 10
    let offset = parseInt(req.query.offset as string, 10) || 0
    let query: string
    type QueryOptions = {
        parameters: {
            COUNTRY?: string
            LIMIT: number
            OFFSET: number
        }
    }
    let options: QueryOptions
    if (country !== '') {
        query = `
          SELECT airport.airportname,
          airport.city,
          airport.country,
          airport.faa,
          airport.geo,
          airport.icao,
          airport.tz
      FROM airport AS airport
      WHERE airport.country=$COUNTRY
      ORDER BY airport.airportname
      LIMIT $LIMIT
      OFFSET $OFFSET;
        `
        options = {
            parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset },
        }
    } else {
        query = `
          SELECT airport.airportname,
          airport.city,
          airport.country,
          airport.faa,
          airport.geo,
          airport.icao,
          airport.tz
      FROM airport AS airport
      ORDER BY airport.airportname
      LIMIT $LIMIT
      OFFSET $OFFSET;
        `

        options = { parameters: { LIMIT: limit, OFFSET: offset } }
    }
    await makeResponse(res, async () => {
        let results: QueryResult = await scope.query(query, options)
        return results['rows']
    })
}

const ListDirectConnection = async (req: Request, res: Response) => {
    const { scope } = await getDatabase()
    // Fetching parameters
    const airport = req.query.airport as string
    let limit = parseInt(req.query.limit as string, 10) || 10
    let offset = parseInt(req.query.offset as string, 10) || 0
    let query: string
    type QueryOptions = {
        parameters: {
            AIRPORT?: string
            LIMIT: number
            OFFSET: number
        }
    }
    let options: QueryOptions
    query = `
      SELECT DISTINCT route.destinationairport
      FROM airport AS airport
      JOIN route AS route ON route.sourceairport = airport.faa
      WHERE airport.faa = $AIRPORT AND route.stops = 0
      ORDER BY route.destinationairport
      LIMIT $LIMIT
      OFFSET $OFFSET
        `
    options = { parameters: { AIRPORT: airport, LIMIT: limit, OFFSET: offset } }
    await makeResponse(res, async () => {
        let results: QueryResult = await scope.query(query, options)
        return results['rows']
    })
}

export {
    createAirport,
    getAirport,
    updateAirport,
    deleteAirport,
    listAirport,
    ListDirectConnection,
}
