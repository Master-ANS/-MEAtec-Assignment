const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'notification-service-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'passport.created', fromBeginning: true });
  await consumer.subscribe({ topic: 'passport.deleted', fromBeginning: true }); 

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const timestamp = message.timestamp; 
      let payload;
      try {
            payload = JSON.parse(message.value.toString()); 
      } catch (err) {
        payload = message.value.toString(); 
      }

      console.log(`[${new Date(Number(timestamp))}] Topic: ${topic}`);
      console.log('Partition:', partition);
      console.log('Message payload:', payload);
      console.log('-----------------------------');

      // Here you could also call an email sending service
      // sendEmailNotification(topic, payload);
    },
  });
};

run().catch(console.error);
