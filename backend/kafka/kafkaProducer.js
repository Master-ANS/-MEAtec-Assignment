const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'battery-passport-service',
    brokers: ['192.168.1.17:9092'] // Change to your broker address
});

const producer = kafka.producer();

let isConnected = false;

// Connect producer once
const connectProducer = async () => {
    if (!isConnected) {
        await producer.connect();
        console.log("Kafka Producer connected");
        isConnected = true;
    }
};

// Send event
const sendEvent = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to topic ${topic}:`, message); // <-- Add this
  } catch (err) {
    console.error('Kafka send error:', err); // <-- Add this
  }
};

module.exports = { producer, connectProducer, sendEvent };
