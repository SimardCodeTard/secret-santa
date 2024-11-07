import { CollectionNamesEnum, findMany, getCollection } from "@/app/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ userId: string}> }) {
    const userId = new ObjectId((await params).userId);
    
    const collection = await getCollection(CollectionNamesEnum.DRAW);

    const draws = await findMany(collection, { memberIds: { $in: [userId] } });

    return new Response(JSON.stringify(draws), { status: 200 });
}