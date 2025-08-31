export const RABBIT_MQ_CONFIG = {
  CONNECTION_STRING: 'RABBITMQ_CONNECTION_STRING',
  REQUEUE_DELAY_MS: 'RABBITMQ_REQUEUE_DELAY_MS',
};

export const rabbitMqConfig = () => ({
  [RABBIT_MQ_CONFIG.CONNECTION_STRING]:
    process.env.RABBITMQ_CONNECTION_STRING ||
    'amqp://guest:guest@localhost:5672',
  [RABBIT_MQ_CONFIG.REQUEUE_DELAY_MS]: Number(
    process.env.RABBITMQ_REQUEUE_DELAY_MS || '30000',
  ),
});
