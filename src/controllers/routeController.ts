import { Route } from '../models/routeModels'
import { Request, Response } from 'express'
import { makeResponse } from '../shared/makeResponse'
import { getDatabase } from '../../db/connection'
import { GetResult } from 'couchbase'

const createRoute = async (req: Request, res: Response) => {
    const newroute: Route = { ...req.body }
    const { routeCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await routeCollection.insert(req.params.id, newroute)
        res.status(201)
        return newroute
    })
}

const getRoute = async (req: Request, res: Response) => {
    let newroute: Route
    const { routeCollection } = await getDatabase()
    await makeResponse(res, async () => {
        let getResult: GetResult = await routeCollection.get(req.params.id)
        newroute = getResult['content']
        return newroute
    })
}

const updateRoute = async (req: Request, res: Response) => {
    const updatedRoute: Route = {
        ...req.body,
    }
    const { routeCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await routeCollection.upsert(req.params.id, updatedRoute)
        return updatedRoute
    })
}

const deleteRoute = async (req: Request, res: Response) => {
    const { routeCollection } = await getDatabase()
    await makeResponse(res, async () => {
        await routeCollection.remove(req.params.id)
        res.status(204)
        return
    })
}

export { createRoute, getRoute, updateRoute, deleteRoute }
