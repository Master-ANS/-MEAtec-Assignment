MEATec Assignment – Battery Passport & Document Management Service

Author: Ayush Singh (Master-ANS)
Tech Stack: Node.js, Express, MongoDB, Mongoose, KafkaJS, AWS S3, JWT, Docker

Project Overview

This project implements a Battery Passport Service with file/document management and notification capabilities. It demonstrates:

JWT-based authentication & role-based access control (admin/client).

Kafka event-driven architecture (producer/consumer).

Uploading files to S3-compatible storage with metadata stored in MongoDB.

Sending notifications on Kafka events (console logging/email-ready hooks).

The project consists of two main modules:

Battery Passport Service

Create, retrieve, update, and delete battery passports.

Emits Kafka events on passport actions (passport.created, passport.updated, passport.deleted).

Document Management Service

Upload, update, delete files to S3.

Store metadata in MongoDB.

Provide downloadable links for uploaded documents.

Features
Authentication & Roles

JWT-based authentication.

Roles: admin and client.

admin can create, update, and delete passports/documents.

client can view passports and download documents.

Kafka Event Handling

KafkaJS producer emits events on passport creation, update, and deletion.

KafkaJS consumer listens to events and logs notifications (email-ready).

File Upload

Files uploaded to S3-compatible storage.

Metadata saved in MongoDB: fileName, s3Key, bucket, size, contentType.

Provides downloadable links.

Setup Instructions
Prerequisites

Node.js v18+

MongoDB running locally or on cloud

Docker (for Kafka and Zookeeper)

AWS account (or any S3-compatible storage)

Environment Variables

Create a .env file in backend/config/ with the following:

PORT=3000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
AWS_ACCESS_KEY_ID=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret>
AWS_REGION=<your_s3_region>
AWS_BUCKET=<your_s3_bucket_name>


Note: .env is added to .gitignore to keep credentials safe.

Install Dependencies
cd backend
npm install

Start MongoDB
# If using Docker (optional)
docker run --name mongodb -p 27017:27017 -d mongo

Start Kafka & Zookeeper (Docker)
# Start Zookeeper
docker run -d --name zookeeper -p 2181:2181 confluentinc/cp-zookeeper

# Start Kafka
docker run -d --name kafka \
  -e KAFKA_PROCESS_ROLES=broker \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka

Start the Server
npm start


You should see:

now responding to port 3000
Kafka Producer connected
MongoDB connected ✅

API Endpoints
Auth
Endpoint	Method	Body	Roles
/api/auth/register	POST	{ "name": "John", "email": "test@test.com", "password": "123456" }	Public
/api/auth/login	POST	{ "email": "test@test.com", "password": "123456" }	Public
Battery Passports
Endpoint	Method	Body	Roles
/api/passports	POST	Battery passport JSON	Admin only
/api/passports/:id	GET	—	Admin, Client
/api/passports/:id	PUT	Updated battery passport JSON	Admin only
/api/passports/:id	DELETE	—	Admin only

Sample Battery Passport Body

{
  "data": {
    "generalInformation": {
      "batteryIdentifier": "BP-2024-011",
      "batteryModel": {"id": "LM3-BAT-2024", "modelName": "GMC WZX1"},
      "batteryMass": 450,
      "batteryCategory": "EV",
      "batteryStatus": "Original",
      "manufacturingDate": "2024-01-15",
      "manufacturingPlace": "Gigafactory Nevada",
      "warrantyPeriod": "8",
      "manufacturerInformation": {"manufacturerName": "Tesla Inc", "manufacturerIdentifier": "TESLA-001"}
    },
    "materialComposition": {
      "batteryChemistry": "LiFePO4",
      "criticalRawMaterials": ["Lithium", "Iron"],
      "hazardousSubstances": [{"substanceName": "Lithium Hexafluorophosphate", "chemicalFormula": "LiPF6", "casNumber": "21324-40-3"}]
    },
    "carbonFootprint": {"totalCarbonFootprint": 850, "measurementUnit": "kg CO2e", "methodology": "LCA"}
  }
}

Document Management
Endpoint	Method	Body	Roles
/api/documents/upload	POST	multipart/form-data, key: file	Admin only
/api/documents/:docId	PUT	{ "fileName": "newName.pdf" }	Admin only
/api/documents/:docId	DELETE	—	Admin only
/api/documents/:docId	GET	—	Admin, Client

Response Example for Upload

{
  "docId": "64f3a2c...",
  "fileName": "passport.pdf",
  "createdAt": "2025-09-13T12:34:56.789Z"
}

Kafka Topics

passport.created – emitted when a passport is created.

passport.updated – emitted when a passport is updated.

passport.deleted – emitted when a passport is deleted.

Notification Service

Kafka consumer listens to these topics.

Logs message payload and timestamp to console (email hooks can be added).

Notes

Always include Bearer <token> in Authorization header for protected routes.

File uploads require multipart/form-data in Postman.

Kafka consumer logs won’t appear until events are emitted by producer (e.g., when creating/updating/deleting passports).

Folder Structure (alot of them are not mentioned  here)
backend/
│
├─ controller/
    |-- documentController.js
│   ├─ passportController.js
│   └─ userAuth.js
├─ kafka/
│   ├─ kafkaProducer.js
│   └─ consumer.js
├─ middleware/
│   ├─ isAuth.js
│   └─ restriction.js
├─ Model/
│   ├─ passportModel.js
│   └─ documentModel.js
├─ helper/
│   └─ s3Service.js
├─ router/
│   ├─ authRoutes.js
│   └─ passportRoutes.js
├─ config/
│   └─ config.env
└─ index.js


This README captures all your work and decisions in the project.
