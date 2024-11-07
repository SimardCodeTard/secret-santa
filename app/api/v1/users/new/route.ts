import { APIBadRequestError, APIConflictError, APIError } from "@/app/lib/errors";
import { CollectionNamesEnum, ENCRYPTION_SALT_ROUNDS, findOne, getCollection, insertOne } from "@/app/lib/mongo";
import { User } from "@/app/lib/types/database";
import { isDefined, parseBody } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { APIResponseStatuses } from "@/app/lib/enums";
import { error } from "@/app/lib/logger";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const user: User = await parseBody<User>(req);
        
        if (!user.email || !user.username || !user.password) {
            throw new APIBadRequestError("Email, username, and password are required");
        }
        
        let collection = await getCollection(CollectionNamesEnum.USER);
        const found = await findOne<User>(collection, { email: user.email });
        
        if (isDefined(found)) {
            throw new APIConflictError("User already exists");
        }
        
        user.password = await bcrypt.hash(user.password, ENCRYPTION_SALT_ROUNDS);
       
        collection = await getCollection(CollectionNamesEnum.USER);
        const insertedId = (await insertOne(collection, user)).insertedId;

        collection = await getCollection(CollectionNamesEnum.USER);
        const insertedUser = await findOne<User>(collection, { _id: new ObjectId(insertedId) });
        insertedUser.password = '';

        return new NextResponse(JSON.stringify(insertedUser), { status: APIResponseStatuses.CREATED });
    } catch(err) {
        error(err as Error);
        if(err instanceof APIError) {
            return new NextResponse(JSON.stringify({ message: err.message }), { status: err.status });
        }
        return new NextResponse(JSON.stringify({ message: 'Unknown internal server error' }), { status: APIResponseStatuses.INTERNAL_SERVER_ERROR });
    }
}