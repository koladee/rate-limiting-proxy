# **Rate Limiting Proxy API**

A proxy service API featuring rate limiting, request queuing, request prioritization, app registration, and detailed analytics. This project is designed to allow users to register their APIs, configure custom rate limiting strategies, and manage requests efficiently while providing comprehensive monitoring and analytics.

---

## **Table of Contents**

1. [Overview](#overview)  
2. [Technologies Used](#technologies-used)  
3. [Setup Instructions](#setup-instructions)  
4. [API Endpoints](#api-endpoints)  
5. [Rate Limiting Strategies](#rate-limiting-strategies)  
6. [Metrics and Monitoring](#metrics-and-monitoring)  
7. [Request Analytics](#request-analytics)  
8. [Example Usage](#example-usage)  

---

## **Overview**

This project enables the following functionalities:  
- API registration with rate limiting configurations.  
- Dynamic rate limit updates.  
- Request queuing and prioritization.  
- Built-in metrics and monitoring for performance tracking.  
- Request analytics to gather insights and trends.  

Designed for scalability and performance, the service integrates seamlessly with tools for metrics and monitoring.

---

## **Technologies Used**

The project leverages the following technologies:  

- **Node.js**: For building the backend service.  
- **TypeScript**: For static typing and code maintainability.  
- **Express.js**: Web framework for handling API routes.  
- **MongoDB**: Database for storing app configurations and analytics.  
- **Prometheus**: Metrics collection and monitoring.  
- **Jest**: Testing framework for unit and integration tests.  

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/koladee/rate-limiting-proxy.git
cd rate-limiting-proxy
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/rateLimitingProxy
```

### **4. Start MongoDB**

Ensure you have MongoDB installed and configured. Run the following command to start the service:

```bash
mongod
```

### **5. Start the Development Server**

```bash
npm run dev
```

### **6. Run Tests**

Ensure all functionalities work as expected by running the test suite:

```bash
npm test
```

---

## **API Endpoints**  

[POSTMAN DOCUMENTATION LINK](https://documenter.getpostman.com/view/40845952/2sAYJAexdW)

### **1. User Management**

#### **Register User**  
**URL:** `/users/register`  
**Method:** `POST`  
**Description:** Registers a new user and returns an API key.  
**Request Body:**  
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com"
}
```
**Response:**  
```json
{
  "_id": "userId",
  "apiKey": "xxxxxxxxxxxxxx",
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com"
}
```

---

### **2. App Registration**

#### **Register an App**  
**URL:** `/apps/register`  
**Method:** `POST`  
**Headers:**  
- `x-api-key`: Your API key.  
**Request Body:**  
```json
{
  "name": "Test App",
  "baseUrl": "https://api.testapp.com",
  "rateLimit": {
    "strategy": "sliding",
    "requestCount": 100,
    "timeWindow": 60000
  }
}
```
**Response:**  
```json
{
  "_id": "uniqueAppId"
}
```

#### **Update Rate Limit Configuration**  
**URL:** `/apps/:appId/update-rate-limit`  
**Method:** `PATCH`  
**Description:** Updates the rate limit configuration for an app.  
**Request Body:**  
```json
{
  "strategy": "fixed",
  "count": 10,
  "timeWindow": 60000
}
```
**Response:**  
- `200`: Rate limit configuration updated successfully.  
- `404`: App not found.  

---

### **3. Proxy Requests**

#### **Proxy a Request**  
**URL:** `/apis/:appId/:endpoint`  
**Method:** `ANY`  
**Headers:**  
- `x-api-key`: Your API key.  
**Response:** Returns the proxied response from the target API.

#### **Request Prioritization**  
Requests can be prioritized by including the `x-priority` header.  
- `x-priority: 0` (highest priority).  
- Higher values indicate lower priorities.

---

## **Rate Limiting Strategies**

### **1. Sliding Window Strategy**
Tracks request counts within a sliding time window.  
- **Request Count**: Maximum allowed requests.  
- **Time Window**: Duration of the window (in ms).  

### **2. Fixed Window Strategy**
Limits requests within fixed intervals, resetting counters after each interval.

---

## **Metrics and Monitoring**

Built-in metrics collected with `express-prometheus-middleware` include:  
- Total requests.  
- Rate-limited requests.  
- Queue length.  

To view metrics, visit:  
`http://localhost:3000/metrics`  

---

## **Request Analytics**

Analytics features include:  
1. **Trend Analysis**: View request trends for an app.  
2. **Response Time Metrics**: Analyze response times by endpoint.  
3. **Recent Requests**: Fetch logs of recent requests.  

**Endpoints:**  
- `/analytics/:appId/trends`  
- `/analytics/:appId/response-times`  
- `/analytics/:appId/recent-requests`  

---

## **Example Usage**

### **1. Register a User**

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com"
  }'
```

### **2. Register an App**

```bash
curl -X POST http://localhost:3000/apps/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "name": "Test App",
    "baseUrl": "https://api.testapp.com",
    "rateLimit": {
      "strategy": "sliding",
      "requestCount": 100,
      "timeWindow": 60000
    }
  }'
```

### **3. Make a Proxied Request**

```bash
curl -X GET http://localhost:3000/proxy/:appId/some-endpoint \
  -H "x-api-key: your-api-key"
```




