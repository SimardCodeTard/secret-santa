import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId,
    username: string,
    password: string,
    email: string,
    drawIDs: ObjectId[]
}

export interface Draw {
    _id: ObjectId,
    createrId: ObjectId,
    name: string,
    maxMemberCount: number,
    memberIds: ObjectId[]
}

export interface Member {
    _id: ObjectId,
    userId: ObjectId,
    name: string,
    pictureURL: string,
    pin: string,
    hasDrawn: boolean,
    wasDrawn: boolean
}

export type MongodItemType = {
    _id?: ObjectId;
}
