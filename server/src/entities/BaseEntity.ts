import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
    @PrimaryKey()
    id!: number;

    @Property({ type: 'date' })
    createdAt = new Date();

    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();
}