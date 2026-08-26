# FarmScheme AI

Build a mobile-first React app called "FarmPay AI — Government Scheme Assistant" using Tailwind CSS, Lucide icons, and Shadcn UI components. 

Create a responsive layout with 3 tabs:

1. FARMER PROFILE TAB:

- Form fields: Full Name (input), State (select with Indian states), District (input), Landholding in Hectares (number input), Category (Select: Small & Marginal [<2ha], Medium [2-10ha], Large [>10ha]), Primary Crops (Paddy, Wheat, Cotton, Maize, Sugarcane - multi-select tags), Irrigation Access (Switch toggle).

- "Save & Find Schemes" primary button connected to Supabase table `farmer_profiles`.

2. SCHEME MATCH DASHBOARD TAB:

- Top stats banner showing: Total Matched Schemes, High Eligibility count, Potential Grant Value.

- Filter pills: All, Eligible (Green 🟢), Likely Match (Yellow 🟡), Potential (Blue 🔵).

- Scheme Cards: Title, Category badge, Status badge, Land limit tag, Brief summary.

- Action buttons per card: 

  - "Why Match?" (opens Eligibility Modal with rule checks)

  - "Documents" (opens Modal with checklist for Aadhaar, Land Records, Bank Passbook)

  - "Apply" (button linking to official portal)

3. SCHEME AI ASSISTANT (CHAT TAB):

- Conversational chat UI with standard message bubbles.

- Floating input bar featuring both Text input and a prominent Microphone (Voice) button.

- Quick suggestion chips: "Am I eligible for PM-KISAN?", "What documents do I need for PMFBY?", "Which schemes offer solar subsidies?"

Make the visual theme Forest Green (#166534), Warm Amber (#d97706), and Slate Gray background. Pre-fill mock state data from Supabase `schemes` table so the UI renders fully right away.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://farmpay-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67ad4410-20b1-4b1c-8727-dd24ed2811ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
