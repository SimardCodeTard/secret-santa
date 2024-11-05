import { CollectionNamesEnum, findMany, getCollection } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export default async function GET(_: NextRequest, params: { userId: string }) {
    const userId = new ObjectId(params.userId);
    
    const collection = await getCollection(CollectionNamesEnum.DRAW);

    const draws = await findMany(collection, { memberIds: { $in: [userId] } });

    return new Response(JSON.stringify(draws), { status: 200 });
}