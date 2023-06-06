import { UserModel } from "./UserModels"

export interface ReferenceModel{
    id?: number,
    author: string,
    title: string,
    year: number,
    month: number,
    day: number,
    year_access: number,
    month_access: number,
    day_access: number,
    pages?: number,
    publisher?: string,
    name_journal?: string,
    name_magazine?: string,
    url?: string,
    type: string,
    user?: UserModel
};