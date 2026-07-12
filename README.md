Mahashankh Real-Time Enterprise Database Gateway

An enterprise-grade, high-performance database gateway built with Node.js, Express, PostgreSQL, and Redis. This system implements robust caching strategies to guarantee sub-15ms data retrieval and extreme stability under high concurrent loads.

🚀 Architecture & Caching Strategies

To maximize throughput and protect the primary relational database, this gateway employs two highly effective distributed caching patterns:

Write-Through Cache (createUser):
When a user is created, the gateway writes the record to PostgreSQL and immediately synchronizes it into Redis. This ensures that the very first read request for this user is instantly available in the cache with zero latency.

Read-Through Cache / Entity Synchronizer (getUserById):
When a user record is requested, the system automatically checks Redis first.

Cache Hit: The record is returned instantly from memory.

Cache Miss: The system falls back to query PostgreSQL, synchronizes the retrieved entity back into Redis with a 1-hour Time-To-Live (TTL), and returns the record to prevent future database roundtrips.

🛠️ Tech Stack

Runtime: Node.js (TypeScript)

API Framework: Express.js

Primary Database: PostgreSQL

Caching Engine: Redis

ORM: Drizzle ORM (Type-safe SQL query generation)

Infrastructure: Docker & Docker Compose (Containerized Postgres and Redis)

Load Testing: Grafana k6

📊 Performance Benchmark (Stress Test Results)

The architecture was put through a rigorous load test using Grafana k6, simulating a sudden usage spike of 100 concurrent Virtual Users (VUs) hammering the retrieval endpoint.

Target Metrics vs. Actual Performance:

Latency Goal: < 15.00ms | Actual Average: 2.23ms ⚡

95th Percentile ($P_{95}$): 4.15ms

System Stability: 99.75% Success Rate (23,274 requests verified)

Throughput: 464.7 requests per second (11,666 complete iterations in 25 seconds)

Database Relief: 99%+ Cache Hit Success Rate (PostgreSQL was queried only once for initial seeding; remaining thousands of requests were served entirely from memory).

(Tip: Take a screenshot of your k6 terminal results or your HTML summary dashboard and insert it here!)

📦 Installation & Setup

Follow these steps to run the gateway locally on your machine.

Prerequisites

Node.js (v16+)

Docker Desktop

Grafana k6 (for running the benchmarks)

1. Clone the Repository

git clone https://github.com/YOUR_USERNAME/mahashankh-gateway.git
cd mahashankh-gateway


2. Configure Environment Variables

Create a .env file in the root directory:

DATABASE_URL=postgres://admin:password123@localhost:5432/mahashankh_db
REDIS_URL=redis://localhost:6379
PORT=3000


3. Spin Up Databases

Run the following command to start PostgreSQL and Redis in containerized isolation:

docker-compose up -d


4. Install Dependencies & Run Database Migrations

npm install
npm run db:generate
npm run db:push


5. Start the Server

npm run dev


The server will boot up and establish connections to PostgreSQL and Redis:

Connected to Redis
Mahashankh Gateway running on port 3000


6. Run the Benchmark

In a separate terminal window, execute the k6 script:

k6 run k6-test.js
