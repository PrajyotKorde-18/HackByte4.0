# BussCon

**A platform where founders pitch ideas and investors track them through a deal pipeline.**

I wanted to build something with two sides: founders who need to get an idea in front of the right people, and investors who need a structured way to evaluate what they find. BussCon is a full-stack app with a Spring Boot backend and a React frontend that covers both.

**Live demo:** [busscon-app.vercel.app](https://busscon-app.vercel.app)
The backend runs on Render, so the first request after a quiet period can take a little while to wake up.

<!-- Add a screenshot or GIF here: docs/dashboard.png -->

---

## What it does

**For founders**
- Submit a startup idea with a category, and get a uniqueness score back
- Track funding needs, monthly runway and cash burn in a financials view

**For investors**
- Browse and filter startup ideas by industry, funding requirement and uniqueness score
- Move startups through a deal board: Discovery, Diligence, Proposal, Funded
- Add notes and record touchpoints on each deal
- Set rules that automate pipeline updates or notifications when a deal matches your criteria

**For everyone**
- Analytics dashboard with total funding, top sectors, monthly sign-ups and engagement

**Built with:** Java 22, Spring Boot 3.3, Spring Data JPA, H2, Thymeleaf, React (Vite), Lucide icons, Maven

## How it's built

| Part | What it is |
|---|---|
| **Backend (root)** | Spring Boot REST API with controllers for ideas, the deal pipeline, automation rules and analytics. Data is stored through Spring Data JPA. |
| **busscon-app/** | React frontend built with Vite. It talks to the API over JSON, with CORS configured for it. |
| **Thymeleaf views** | Server-rendered pages served by the same Spring Boot app. |

```
Investor-founder-Platform-BussCon-/
├── pom.xml                   # Maven config
├── mvnw / mvnw.cmd           # Maven wrapper
├── src/
│   ├── main/java/com/busscon/   # Controllers, models, repositories, config
│   ├── main/resources/
│   │   ├── templates/           # Thymeleaf pages
│   │   └── static/              # CSS, JS, images
│   └── test/                    # JUnit and MockMvc tests
└── busscon-app/              # React frontend
    ├── src/                     # Components, pages, utils
    ├── package.json
    └── vite.config.ts           # Dev server and API proxy
```

## Run it locally

You'll need Java 22+ and Node.js 18+.

**1. Start the backend**

```bash
git clone https://github.com/PrajyotKorde-18/Investor-founder-Platform-BussCon-.git
cd Investor-founder-Platform-BussCon-

./mvnw spring-boot:run        # macOS / Linux (run chmod +x mvnw first)
mvnw.cmd spring-boot:run      # Windows
```

The API starts at http://localhost:8080.

The app uses an in-memory H2 database, so data resets on every restart. To inspect it, open http://localhost:8080/h2-console with:

- JDBC URL: `jdbc:h2:mem:busscondb`
- Username: `sa`
- Password: leave blank

**2. Start the frontend**

```bash
cd busscon-app
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies API calls to port 8080.

## Deployment

- Frontend: Vercel
- Backend: Render

## What I learned

- Keeping the backend and frontend in one repo made local setup simple, but deployment needed two separate pipelines
- CORS and proxy settings are easy to get wrong until the frontend and backend run on different hosts
- An in-memory database is great for fast development, but it needs a real database before anyone can depend on the data

## Roadmap

- [ ] Swap H2 for PostgreSQL so data persists
- [ ] User authentication and separate founder and investor accounts
- [ ] More test coverage on the pipeline and automation rules

## Author

**Prajyot Korde**, IT undergrad at Ramdeobaba University
[LinkedIn](https://www.linkedin.com/in/prajyot-korde-912621281) · [GitHub](https://github.com/PrajyotKorde-18)
