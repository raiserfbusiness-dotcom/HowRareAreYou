# HOW RARE ARE YOU? (HRAU)

> There are billions of people on Earth. How many of them are actually like you?

**HOW RARE ARE YOU?** is a privacy-first interactive statistical curiosity engine. Visitors answer a rapid sequence of everyday questions about themselves and discover an estimated statistical rarity for their combination of characteristics, their rarest 4-trait overlap, and their estimated number of statistical twins across an ~8.1 billion global reference model.

---

## Architecture & Project Structure

```text
/src
  /components
    PopulationField.tsx      # 60fps offscreen-buffered canvas dot-population animation
    Navbar.tsx               # Minimal 3-zone top bar
    Footer.tsx               # Minimal footer with disclaimer & privacy summary
    Hero.tsx                 # Landing experience + interactive combination funnel preview
    ProgressBar.tsx          # Thin progress line & question counter
    QuestionScreen.tsx       # Interactive single-question view with keyboard & touch support
    CalculationAnimation.tsx # Anticipation sequence before result reveal
    RarityReveal.tsx         # Progressive result reveal, logarithmic counter & breakdown
    StatisticalTwins.tsx     # "How Many of You?" & "Somewhere on Earth..." visual matrix
    BecomeRarerGame.tsx      # Optional "Can You Get Rarer?" second gameplay loop
    RarityCard.tsx           # Vertical mobile-screenshot-ready share card
    ShareButton.tsx          # Web Share API, clipboard link copy, and PNG card download
    Challenge.tsx            # Friend challenge creator & incoming challenge landing screen
    EditorialPages.tsx       # About, Methodology (with live distribution explorer), Privacy, Contact
  /lib
    /rarity
      distributions.ts       # Demographic & behavioral distributions with source/confidence metadata
      questions.ts           # Core (12) and Bonus (6) question definitions
      rarityEngine.ts        # Conditional probability & covariance-adjusted rarity estimator
      confidence.ts          # Confidence tier evaluator & uncertainty interval calculator
      validation.ts          # Answer validation & edge-case handling
      /__tests__
        rarityEngine.test.ts # Automated unit test suite
    analytics.ts             # Privacy-safe anonymous event tracking abstraction
    share.ts                 # Privacy-safe URL token encoder/decoder & HTML5 Canvas card renderer
  /types
    quiz.ts
    rarity.ts
```

---

## Statistical Philosophy & Honesty

- **Estimates, Not Diagnoses**: Results are clearly presented with `~`, `estimated`, uncertainty intervals, and confidence tiers (`HIGH CONFIDENCE`, `MEDIUM CONFIDENCE`, `LOW CONFIDENCE`).
- **Covariance & Correlation Adjustments**: Rather than blindly multiplying correlated traits (such as night-owl chronotypes and sleeping past midnight, or birth region and multilingualism), the engine applies explicit conditional probability dampeners and a high-dimensionality shrinkage factor.
- **Privacy by Architecture**: All calculations happen client-side in the browser. Share and challenge URLs (`/result/[token]`, `/challenge/[token]`) encode only the high-level summary card metrics and never expose raw questionnaire answers or personally identifying information.

---

## Environment Variables

Copy `.env.example` to `.env` to configure optional settings:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_DEMO_MODE` | `true` | Displays a subtle `DEMO ESTIMATE` label indicating that behavioral distributions use prototype statistical estimates. |
| `VITE_APP_URL` | `https://howrareareyou.com` | Canonical base URL used for fallback share links. |

---

## Development, Testing & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Starts the application on `http://localhost:3000`.

### 3. Run Unit Tests & Type Check
```bash
npm test
npm run lint
```

### 4. Production Build & Deployment
```bash
npm run build
npm run preview
```
The production build outputs static assets to `dist/`. Configure your static host or CDN (Cloud Run, Vercel, Netlify, Cloudflare Pages) to rewrite SPA routes (`/quiz`, `/result/*`, `/challenge/*`, `/about`, `/methodology`, `/privacy`, `/contact`) to `/index.html`.
