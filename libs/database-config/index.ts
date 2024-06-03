import { String } from "aws-sdk/clients/batch";

export interface DatabaseAdaptor<T> {
    add(item: T): Promise<void>;
    delete(id: String): Promise<void>;
    getAll(): Promise<T[]>;
    update(id: string, item: T): Promise<void>;
    getById(id: string): Promise<T | undefined>;
    markDone(id: string): Promise<void>;
    markUndone(id: string): Promise<void>;

}