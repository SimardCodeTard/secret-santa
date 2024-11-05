import { APIBadRequestError, APIForbiddenError } from "@/app/lib/errors";
import { CollectionNamesEnum, ENCRYPTION_SALT_ROUNDS, findOne, getCollection } from "@/app/lib/mongo";
import { User } from "@/app/lib/types/database";
import { parseBody } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { APIResponseStatuses } from "@/app/lib/enums";

export async function POST(req: NextRequest) {
    
    try {
        const user = await parseBody<User>(req);

        if(!user.username || !user.email || !user.password) {
            throw new APIBadRequestError("Email, username, and password are required");
        }

        const collection = await getCollection(CollectionNamesEnum.USER);
        const found = await findOne<User>(collection, { email: user.email });

        if(await bcrypt.hash(user.password, ENCRYPTION_SALT_ROUNDS) === found.password) {
            // TODO: IMPLEMENT SESSION & REFRESH TOKENS
            return new NextResponse(JSON.stringify({ user: found }), { status: APIResponseStatuses.SUCCESS });
        }
        throw new APIForbiddenError("Invalid credentials");
    } catch (err) {
        if(err instanceof APIBadRequestError) {
            return new NextResponse(JSON.stringify({ message: err.message }), { status: err.status });
        }
        return new NextResponse(JSON.stringify({ message: 'Unknown internal server error' }), { status: APIResponseStatuses.INTERNAL_SERVER_ERROR });
    }

}