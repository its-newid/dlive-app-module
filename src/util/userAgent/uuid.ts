import { v4, validate as uuidValidate } from 'uuid';

export abstract class UUIDGenerator {
    uuid: string;

    constructor(uuid?: string) {
        this.uuid = uuid || this.generate();
    }

    protected abstract generate(): string;

    public getUUID() {
        return this.uuid;
    }

    public static validate(uuid: string): boolean {
        return uuidValidate(uuid);
    }
}

export class UUIDGeneratorWithV4 extends UUIDGenerator {
    protected generate(): string {
        return v4();
    }
}
