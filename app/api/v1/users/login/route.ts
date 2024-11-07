import { APIBadRequestError, APIError, APIForbiddenError } from "@/app/lib/errors";
import { CollectionNamesEnum, findOne, getCollection } from "@/app/lib/mongo";
import { User } from "@/app/lib/types/database";
import { isDefined, parseBody } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { APIResponseStatuses } from "@/app/lib/enums";
import { error } from "@/app/lib/logger";
import { debug } from "console";

export async function POST(req: NextRequest) {
    
    try {
        const user = await parseBody<User>(req);

        if(!user.email || !user.password) {
            throw new APIBadRequestError("Email, username, and password are required");
        }

        const collection = await getCollection(CollectionNamesEnum.USER);
        const found = await findOne<User>(collection, { email: user.email }) as any;

        if(!isDefined(found) || !isDefined(found.password) || !isDefined(found.email)) {
            throw new APIForbiddenError("Invalid credentials");
        }

        if(await bcrypt.compare(user.password, found.password)) {
            // TODO: IMPLEMENT SESSION & REFRESH TOKENS
            found.password = '';
            return new NextResponse(JSON.stringify({ user: found }), { status: APIResponseStatuses.SUCCESS });
        }

        throw new APIForbiddenError("Invalid credentials");
    } catch (err) {
        error(err as Error);
        if(err instanceof APIError) {
            debug('1')
            return new NextResponse(JSON.stringify({ message: err.message }), { status: err.status });
        }
        return new NextResponse(JSON.stringify({ message: 'Unknown internal server error' }), { status: APIResponseStatuses.INTERNAL_SERVER_ERROR });
    }

}