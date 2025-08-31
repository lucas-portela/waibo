import { ZodDto } from 'src/application/types';

export type QueuePublish<Type, DtoType = ZodDto<Type>> = {
  topic: string;
  data: Type;
  dto: DtoType;
};

export type QueueSubscriptionHandler<Type> = (params: {
  data: Type;
  topic: string;
  sentAt: Date;
}) => Promise<void>;

export type QueueSubscribe<Type> = {
  topic: string;
  dto: ZodDto<Type>;
  handler: QueueSubscriptionHandler<Type>;
};

export type QueueSubscription = {
  unsubscribe: () => Promise<void>;
};

export interface QueueService {
  publish<Type>(message: QueuePublish<Type>): Promise<void>;
  subscribe<Type>(params: QueueSubscribe<Type>): Promise<QueueSubscription>;
}
