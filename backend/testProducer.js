const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'passport.created',
    messages: [{ value: JSON.stringify({ test: 'hello world' }) }]
  });
  await producer.disconnect();
};

run();
