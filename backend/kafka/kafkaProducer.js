const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'battery-passport-service',
    brokers: ['192.168.1.17:9092'] 
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer  connected");
};

const sendEvent = async (topic, message) => {
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
    });
};

module.exports = { producer, connectProducer, sendEvent };
