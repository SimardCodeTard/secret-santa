import assert from "assert";
import { APIBadRequestError } from "./errors";

export async function parseBody<T = unknown>(req: Request): Promise<T> {
    // Throw a 400 error if the body is empty
    if (req.body === null) {
        throw new APIBadRequestError('Request body is empty');
    }

    try {
        const chunks = [];
        // The body is a readable binary stream
        const reader = req.body.getReader();

        // Read the body into chunks
        let readResult;
        while (!(readResult = await reader.read()).done) { // While there is still data to read
            const value = readResult.value;
            if (value !== undefined) { 
                chunks.push(value);
            }
        }

        // Concatenate the chunks into a single string buffer
        const data = Buffer.concat(chunks).toString();
        // Parse the body as JSON
        return JSON.parse(data) as T;
    } catch (error) {
        if(error instanceof SyntaxError) throw new APIBadRequestError('Request body is not valid JSON'); // Throw a 400 error if the body is not valid JSON
        else throw error;
    }
}

export const isDefined = (toCheck: unknown) => toCheck !== undefined && toCheck !== null && toCheck !== '' && typeof toCheck === 'number' ? !isNaN(toCheck as number) : true;

export const assertDefined = (toAssert: unknown) => {
    assert(isDefined(toAssert));
}