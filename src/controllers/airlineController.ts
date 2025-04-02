import { Airline } from '../models/airlineModels'
import { Request, Response } from 'express'
import { makeResponse } from '../shared/makeResponse'
import { getDatabase } from '../../db/connection'
import { GetResult, QueryResult } from 'couchbase'

const createAirline = async (req: Request, res: Response) => {
    let newAirline: Airline = {
        ...req.body,
    }
    const { airlineCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airlineCollection.insert(req.params.id, newAirline)
        res.status(201)
        return newAirline
    })
}

const getAirline = async (req: Request, res: Response) => {
    let newAirline: Airline
    const { airlineCollection } = await getDatabase()
    await makeResponse(res, async () => {
        const getResult: GetResult = await airlineCollection.get(req.params.id)
        newAirline = getResult['content']
        return newAirline
    })
}

const updateAirline = async (req: Request, res: Response) => {
    let newAirline: Airline = {
        ...req.body,
    }
    const { airlineCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airlineCollection.upsert(req.params.id, newAirline)
        return newAirline
    })
}

const deleteAirline = async (req: Request, res: Response) => {
    const { airlineCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await airlineCollection.remove(req.params.id)
        res.status(204)
        return
    })
}

const listAirlines = async (req: Request, res: Response) => {
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
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          WHERE airline.country = $COUNTRY
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `
        options = {
            parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset },
        }
    } else {
        query = `
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `

        options = { parameters: { LIMIT: limit, OFFSET: offset } }
    }
    await makeResponse(res, async () => {
        const results: QueryResult = await scope.query(query, options)
        return results['rows']
    })
}

const listAirlinesToAirport = async (req: Request, res: Response) => {
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
          SELECT air.callsign,
              air.country,
              air.iata,
              air.icao,
              air.name
          FROM (
              SELECT DISTINCT META(airline).id AS airlineId
              FROM route
              JOIN airline ON route.airlineid = META(airline).id
              WHERE route.destinationairport = $AIRPORT
          ) AS subquery
          JOIN airline AS air ON META(air).id = subquery.airlineId
          ORDER BY air.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `
    options = { parameters: { AIRPORT: airport, LIMIT: limit, OFFSET: offset } }
    await makeResponse(res, async () => {
        const results: QueryResult = await scope.query(query, options)
        return results['rows']
    })
}

export {
    createAirline,
    getAirline,
    updateAirline,
    deleteAirline,
    listAirlines,
    listAirlinesToAirport,
}
