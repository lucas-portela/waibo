export type BaseSnapshot = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type EntitySnapshot<SnapshotType> = BaseSnapshot & SnapshotType;

export abstract class BaseEntity<SnapshotType extends BaseSnapshot> {
  id: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(data: Partial<SnapshotType> = {}) {
    this.set(data);
  }

  set(data: Partial<SnapshotType> = {}) {
    if (data.id) this.id = data.id;
    if (data.createdAt) this.createdAt = data.createdAt;
    if (data.updatedAt) this.updatedAt = data.updatedAt;

    this._set(data);
  }

  snapshot(): SnapshotType {
    return {
      id: this.id,
      ...this._snapshot(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as SnapshotType;
  }

  protected abstract _set(data: Partial<SnapshotType>): void;
  protected abstract _snapshot(): Omit<SnapshotType, keyof BaseSnapshot>;
}
