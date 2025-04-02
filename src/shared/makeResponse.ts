import { Response } from 'express'
import { CouchbaseError } from 'couchbase'

interface ErrorResponse {
    message: string
}

async function makeResponse(res: Response, action: () => Promise<any>) {
    try {
        const result = await action()
        res.json(result)
    } catch (e: any) {
        console.error(e)
        let status: number

        if (isCouchbaseError(e) && e.message.indexOf('not found') !== -1) {
            status = 404
        } else {
            status = isCouchbaseError(e) ? 400 : 500
        }

        const errorResponse: ErrorResponse = { message: e.message }
        res.status(status)
        res.json(errorResponse)
    }
}

// Check if the error is of type CouchbaseError
function isCouchbaseError(error: any): error is CouchbaseError {
    return typeof error === 'object' && error !== null && 'message' in error
}

export { makeResponse }
