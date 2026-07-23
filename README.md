# Serenity ETM

> An emotion-aware adaptive email and task manager that infers user stress in real time and simplifies the interface when cognitive load is elevated — without interrupting workflow.

[![Live App](https://img.shields.io/badge/Live%20App-Vercel-000000?style=flat&logo=vercel)](https://serenity-etm.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com)

---

## Overview

Modern productivity tools are designed for an idealised user — focused, unhurried, emotionally neutral. Real users are rarely any of those things. Email clients and task managers remain entirely static regardless of whether you are calm or three hours from a deadline with 60 unread emails. They do not know the difference. They do not adapt.

Serenity ETM addresses this. It is a unified email and task management platform that performs real-time facial emotion inference entirely within the browser — no data leaves the client — and uses the inferred stress signal to gradually simplify the interface when elevated cognitive load is detected. High-priority content is surfaced, low-priority content is filtered, and the visual environment shifts toward calmer palettes. When stress peaks, a brief recovery overlay interrupts the workflow just long enough to help.

The system is grounded in research across affective computing, technostress, calm technology design, and human-computer interaction. It was evaluated through two controlled usability studies and a heuristic inspection. The core finding: a **30% reduction in perceived cognitive overwhelm** (2.7 → 1.9 on a 5-point scale) with the adaptive interface active.

**Live:** [serenity-etm.vercel.app](https://serenity-etm.vercel.app)

---

## Features

### Adaptive Interface System

The interface adapts across four mechanisms, each activating at different stress thresholds:

**Focus Mode** — activates when stress exceeds 70/100. Collapses navigation sidebars and filters email and task lists to high-priority items only. A persistent mode banner communicates that filtering is active. Deactivates automatically when stress returns below threshold.

**Priority Mode** — sorts all emails and tasks by priority tier (high / normal / low) regardless of timestamp. Available as both an automatic adaptive response and a manually activated organisational tool.

**Adaptive Colour Feedback** — interface background and accent colours interpolate continuously between three stress-state palettes using linear RGB interpolation (`C = C1 + (C2–C1) × t`). Transitions are gradual and peripheral — visible if noticed, unobtrusive if not. Grounded in colour psychology research showing cooler, desaturated hues reduce physiological arousal.

| Stress State | Background | Accent |
|---|---|---|
| Low (0–40) | `#f5f5f5` fresh snow | `#8e918b` weathered stone |
| Moderate (40–70) | `#ebedec` morning mist | `#7fb8b6` sea glass |
| High (70–100) | `#eef0f2` cool ice | `#2e4a66` deep navy |

**Calm Visual Overlay** — activates at stress above 90. Replaces the workspace with a full-screen recovery environment: soft animated gradient blobs in cool blue-grey tones and the prompt *"Let's slow things down for a moment."* A visible countdown (default: 10 seconds) keeps the pause bounded. Dismissible at any time. A 15-minute cooldown prevents repeated activation during sustained high-stress periods.

---

### Emotion Inference Pipeline

Facial analysis is performed by the [MorphCast Emotion AI SDK](https://morphcast.com), running entirely within the browser. Four signals are extracted per frame:

- **Arousal** — physiological activation level
- **Valence** — positive vs. negative emotional state
- **Visual Attention** — engagement with the screen
- **Emotion Probabilities** — per-emotion confidence scores (anger, fear, disgust, sadness, surprise, happiness)

These feed a custom multi-stage stress estimation model:

**Stage 1 — Base stress:**
```
S_base = Arousal × (1 – Valence)
```
Higher arousal combined with lower valence (negative emotional state) produces stronger stress signals.

**Stage 2 — Attention weighting:**
```
S_attention = S_base × Attention
```
Amplifies stress when the user is actively engaged with the screen rather than looking away.

**Stage 3 — Emotion bias:**
Weighted sum of emotion probabilities. Negative emotions (anger: 1.0, fear: 1.0, disgust: 0.6, sadness: 0.5, surprise: 0.3) increase the estimate. Positive emotions (happiness: −0.7) reduce it.

**Stage 4 — Non-linear scaling:**
```
S_final = (S_attention + E_bias)^α
```
Where α is a configurable sensitivity parameter stored in the user's profile, enabling per-user calibration. The resulting value is normalised to a 0–100 scale.

**Stage 5 — Temporal smoothing:**
Raw emotion signals fluctuate due to transient facial movements and environmental noise. The displayed stress value interpolates gradually toward the calculated target over a configurable interval (default: 10 seconds), attenuating noise while remaining responsive to sustained changes.

---

### Hysteresis Control

A hysteresis model governs adaptive feature activation, preventing rapid oscillation when stress values hover near a threshold boundary.

Adaptive features activate when stress exceeds an upper threshold and remain active until stress falls below a separate, lower deactivation threshold. This separation stabilises interface behaviour against momentary signal fluctuations.

| Feature | Activation | Deactivation | Cooldown |
|---|---|---|---|
| Focus Mode | > 70 | < 40 | None |
| Calm Visual Overlay | > 90 | < 70 | 15 minutes |
| Colour adaptation | Continuous | Continuous | None |

---

### NLP Priority Classifier

Emails and tasks without a user-assigned priority are automatically classified by a rule-based keyword classifier. Six weighted categories:

| Category | Example Keywords | Effect |
|---|---|---|
| Urgent | urgent, ASAP, immediately | Strong positive weight |
| Deadline | due today, overdue, deadline | Strong positive weight |
| Risk | payment failed, blocked, rejected | Strong positive weight |
| Approval | please approve, confirm, required | Moderate positive weight |
| Direct Request | can you, need you to | Moderate positive weight |
| Marketing | sale, offer, newsletter, unsubscribe | Negative weight |

Subject lines receive additional weighting. Temporal expressions (*"due tomorrow"*, *"by end of week"*) apply a further multiplier. The resulting score maps to high / normal / low priority. Users can override at any time — manual priority always takes precedence, and the priority source (manual vs. inferred) is stored separately in the database.

---

### Dashboard

The landing screen after login surfaces three panels:

**Focus Mode This Week** — a bar chart of daily Focus Mode activation counts across the current week. A user who sees 3 activations on Tuesday and 0 on Thursday has actionable information about their own stress patterns.

**Today's Mood** — an interpreted emotional state label (Stable / Tense / Recovering) derived from the day's Focus Mode activation count. Presented as a readable label rather than a raw number.

**Priority Emails & Priority Tasks** — the three highest-priority items in each category, surfaced immediately on landing. The first thing a user sees is their most important work, not their most recent.

---

### Task Manager

Dual view system — users switch freely between:

**Card view** — rich tiles showing title, due date, visual progress bar, progress status badge (Not Started / In Progress / Almost Complete / Completed), and priority badge.

**List view** — compact scannable table with the same fields. Useful for reviewing large task backlogs quickly.

During Focus Mode, tasks below the high-priority threshold are filtered from both views.

---

### Email Manager

Standard inbox with Starred, Important, Sent, Drafts, and Archive categorisation. Priority badges (high / normal / low) rendered per email based on classifier output or manual assignment. Reply panel opens inline without navigating away from the list. Batch select and action support across all folders.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  React Components · Dashboard · Email · Tasks        │
│              Global State (Zustand)                  │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐  ┌─────────────────────────┐
│  Emotion Inference   │  │   Adaptive Interface    │
│  MorphCast SDK       │  │   Engine                │
│  Signal Extraction   │  │   Threshold Evaluation  │
│  Stress Calculation  │  │   Hysteresis Control    │
│  Temporal Smoothing  │  │   Mode Selection        │
└──────────┬───────────┘  └──────────┬──────────────┘
           │                         │
           └────────────┬────────────┘
                        ▼
           ┌─────────────────────────┐
           │    Data Services        │
           │  Supabase Auth          │
           │  PostgreSQL (RLS)       │
           └─────────────────────────┘
```

### Frontend

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS with dynamic CSS variable injection for stress-driven colour adaptation
- **State:** Zustand — separate stores for email state, task state, and global emotion value. Reactive observers in the application shell monitor the emotion store and trigger adaptive behaviours without coupling to individual components
- **Emotion hook:** Custom React hook handles MorphCast SDK initialisation, signal aggregation, stress calculation, and global state updates at configurable intervals

### Backend & Database

- **Auth:** Supabase Auth with email/password, session tokens, and email verification
- **Database:** PostgreSQL via Supabase with four core tables:

| Table | Purpose |
|---|---|
| `emails` | Email records with sender, receiver, subject, body, priority, priority_src, folder, read/star/delete state |
| `tasks` | Task items with title, description, due date, priority, priority_src, progress, completion state |
| `profiles` | User configuration including theme, adaptive settings, and stress sensitivity parameter |
| `focus_triggers` | Timestamps of Focus Mode activations — used to populate the weekly dashboard chart |

- **Row-Level Security:** RLS policies on all tables enforce that `auth.uid() = user_id` on every query. Data isolation is enforced at the database level, not the application layer.

### Application Shell

A central `AppShell` component coordinates all adaptive behaviour. It observes the global emotion value from Zustand and evaluates thresholds on each update, triggering interface adjustments (sidebar collapse, content filtering, overlay activation, colour provider updates) without modifying individual page components. Centralising adaptive orchestration here decouples adaptive logic from productivity logic entirely.

---

## Evaluation

### Study 1 — A/B Interface Comparison (n=8)

Two complete interface versions were built and tested before final implementation. Both had identical functionality and adaptive logic, differing only in colour transition behaviour.

**Version A** — stronger, more saturated adaptive colour transitions.
**Version B** — subtler, desaturated peripheral colour cues.

Participants completed productivity tasks (email prioritisation, task organisation) under both conditions. Results:

| Version | Participants Preferred | Percentage |
|---|---|---|
| Version A (strong transitions) | 1 | 12.5% |
| Version B (subtle transitions) | 7 | **87.5%** |

Key feedback: Version A's stronger transitions occasionally caused hesitation mid-task — the opposite of the intended effect. Version B's transitions were described as calmer and less distracting. These findings directly shaped the final colour system before production implementation.

---

### Study 2 — Within-Subjects Controlled Experiment (n=10)

Counterbalanced design (5 participants: baseline → adaptive; 5 participants: adaptive → baseline) to control for learning effects. Participants completed identical productivity task sets under both conditions using the same pre-populated dataset. Task completion time recorded as an objective measure. Post-condition questionnaires based on NASA-TLX workload dimensions (mental demand, effort, time pressure, frustration, overwhelm, stress) and usability ratings (ease of use, confidence, task effectiveness, likelihood of regular use) on a 1–5 Likert scale.

**Task Performance:**

| | Baseline | Adaptive | Change |
|---|---|---|---|
| Average completion time | 104.1s | 99.6s | −4.5s |

6 of 10 participants completed tasks faster under the adaptive condition. 4 were slower, suggesting an initial interaction overhead or adjustment cost for some users.

**Perceived Workload (lower is better):**

| Metric | Baseline | Adaptive | Change |
|---|---|---|---|
| Mental demand | 2.0 | 1.8 | −10% |
| Perceived overwhelm | 2.7 | 1.9 | **−30%** |
| Frustration | 2.1 | 1.8 | −14% |
| Feeling rushed | 2.4 | 2.1 | −13% |
| Stress during tasks | 2.3 | 2.0 | −13% |

**Perceived Usability (higher is better):**

| Metric | Baseline | Adaptive | Change |
|---|---|---|---|
| Ease of use | 4.0 | 4.1 | +2.5% |
| Confidence using system | 3.8 | 4.0 | +5.3% |
| Task management effectiveness | 3.7 | 3.9 | +5.4% |
| Likelihood of regular use | 3.5 | 3.6 | +2.9% |

The most significant result was the **30% reduction in perceived overwhelm** — the primary design target. Adaptive interface behaviour meaningfully reduced perceived cognitive strain even where objective performance gains were modest.

---

### Heuristic Evaluation (Nielsen's 10 Usability Heuristics)

| Heuristic | Assessment |
|---|---|
| Visibility of system status | Strong — stress value (0–100), mode banner, and dashboard metrics provide continuous feedback |
| User control and freedom | Strong — all adaptive features manually overridable and dismissible |
| Consistency and standards | Strong — uniform layout structure and interaction patterns across all views |
| Error prevention | Gap identified — no deletion confirmation. Flagged for future iteration |
| Recognition rather than recall | Strong — clear labels, icons, and categorisation throughout |

### System Behaviour Evaluation

Temporal smoothing, hysteresis control, and threshold triggering were all verified to operate stably under simulated stress signal patterns. The smoothing mechanism successfully attenuated transient signal noise without delaying response to sustained stress changes.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+ (for LLM extension only)
- A [Supabase](https://supabase.com) project (free tier sufficient)
- A [MorphCast](https://morphcast.com) SDK key

### 1. Clone the Repository

```bash
git clone https://github.com/rubaisha-rn/Serenity-ETM.git
cd Serenity-ETM
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MorphCast SDK
NEXT_PUBLIC_MORPHCAST_KEY=your-morphcast-sdk-key
```

### 4. Set Up the Database

Run the following SQL in your Supabase SQL Editor to create the schema and enable Row-Level Security:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  theme TEXT DEFAULT 'light',
  theme_mode TEXT DEFAULT 'system',
  calm_mode_duration INT DEFAULT 10,
  sdk_active BOOL DEFAULT FALSE,
  stress_detection_duration INT DEFAULT 10,
  stress_sensitivity FLOAT DEFAULT 1.0,
  emotion_value INT DEFAULT 0,
  grid BOOL DEFAULT TRUE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- Emails table
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  receiver_id UUID REFERENCES profiles(id),
  sender_id UUID REFERENCES profiles(id),
  subject TEXT,
  body TEXT,
  priority TEXT DEFAULT 'normal',
  is_read BOOL DEFAULT FALSE,
  starred BOOL DEFAULT FALSE,
  folder TEXT DEFAULT 'inbox',
  priority_src TEXT DEFAULT 'auto',
  reply_to UUID,
  is_delete BOOL DEFAULT FALSE
);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own emails"
  ON emails FOR ALL
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id),
  title VARCHAR NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'normal',
  due_date TIMESTAMPTZ,
  completed BOOL DEFAULT FALSE,
  priority_src TEXT DEFAULT 'rules',
  is_delete BOOL DEFAULT FALSE,
  progress TEXT DEFAULT 'not_started'
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

-- Focus triggers table
CREATE TABLE focus_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id)
);

ALTER TABLE focus_triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own focus triggers"
  ON focus_triggers FOR ALL
  USING (auth.uid() = user_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 6. Demo Account

A pre-populated demo account is available at the live deployment for immediate exploration without setup. Credentials are available upon email.

---

## Project Structure

```
serenity-etm/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Sign in / Sign up pages
│   ├── dashboard/                # Dashboard page
│   ├── emails/                   # Email manager page
│   ├── tasks/                    # Task manager page
│   └── layout.tsx                # Root layout with AppShell
│
├── components/
│   ├── shell/                    # AppShell — adaptive orchestration
│   ├── email/                    # Email list, reply panel, compose
│   ├── tasks/                    # Task list, card view, list view
│   ├── dashboard/                # Focus Mode chart, mood card
│   ├── adaptive/                 # CalmOverlay, ModeIndicator
│   └── ui/                       # Shared UI primitives
│
├── hooks/
│   ├── useEmotionInference.ts    # MorphCast SDK integration
│   ├── useAdaptiveEngine.ts      # Threshold + hysteresis logic
│   └── useColourProvider.ts      # CSS variable interpolation
│
├── stores/
│   ├── emotionStore.ts           # Global stress value (Zustand)
│   ├── emailStore.ts             # Email state and filters
│   └── taskStore.ts              # Task state and filters
│
├── lib/
│   ├── supabase/                 # Supabase client and queries
│   ├── classifier/               # NLP priority classifier
│   └── colours/                  # Palette definitions + interpolation
│
└── public/
```

---

## Design Decisions

**Why client-side emotion inference?**
Privacy. Sending facial imagery or biometric signals to an external server — even for analysis — raises significant consent and data ownership questions in a productivity context. MorphCast's SDK performs all analysis locally via WebAssembly. No biometric data leaves the browser at any point.

**Why hysteresis instead of a single threshold?**
A single threshold causes rapid oscillation when stress values fluctuate near the boundary — the interface would repeatedly enter and exit Focus Mode within seconds, which is more disruptive than useful. Separate activation and deactivation thresholds create a stable band. Once Focus Mode activates at 70, it stays active until stress falls to 40 — a meaningful, sustained recovery rather than a momentary dip.

**Why temporal smoothing?**
Facial expression is inherently noisy. A brief facial movement — a blink, a yawn, a sideways glance — should not trigger an interface state change. Interpolating toward a target value over 10 seconds means only sustained emotional states drive adaptation, which matches the intended design: responding to genuine cognitive load, not transient expressions.

**Why multiplicative fitness components in the stress model?**
Additive combination allows individual signals to dominate — very high arousal could produce high stress even with strongly positive valence. Multiplicative combination (base stress = arousal × (1 − valence)) ensures that both signals must contribute for stress to be elevated, which better reflects the cognitive reality that stress involves both physiological activation and negative emotional valence simultaneously.

**Why a rule-based classifier rather than an ML model?**
Two reasons. First, interpretability — a rule-based classifier produces the same output for the same input every time, and the rationale is transparent and auditable. Second, domain specificity — email and task priority signals are well-defined enough that a carefully designed keyword system performs reliably without requiring training data. An ML model would require labelled email datasets that introduce privacy concerns and may not generalise to individual users' communication patterns.

**Why separate activation and display stress values?**
The raw calculated stress value updates continuously as new emotion frames arrive. Displaying this directly would produce jittery, rapidly changing UI feedback. The displayed value is a smoothed version that interpolates toward the raw target. This separation means the display is stable and readable while the underlying calculation remains responsive.

---

## Limitations

**Emotion inference is probabilistic, not precise.** The system infers cognitive state from surface-level facial signals, not direct measurement of cognitive load. Two people with identical facial expressions may have entirely different internal states. The design treats inferred stress as a contextual indicator rather than a ground truth, which is why all adaptive features are transparent, reversible, and manually overridable.

**Evaluation was short-term.** The controlled study captured initial interaction effects, not long-term behaviour. Adaptive systems may produce different patterns over weeks of use — users may habituate to features, develop different interaction strategies, or find that features they initially found useful become less relevant over time.

**The sample size is small.** 10 participants in the within-subjects study is consistent with established usability testing practice for identifying key interaction patterns, but limits the generalisability of quantitative findings.

**Environmental factors affect inference quality.** Poor lighting, unusual camera angles, glasses, or facial coverings can reduce the reliability of MorphCast's signal extraction. The temporal smoothing and hysteresis mechanisms mitigate the impact of degraded signals but do not eliminate it.

---

## Acknowledgements

- [MorphCast](https://morphcast.com) for the Emotion AI SDK
- [Supabase](https://supabase.com) for backend infrastructure
- Research foundations: Picard (1997) on affective computing; Weiser & Brown (1997) on calm technology; Albulescu et al. (2022) on micro-break interventions; Valdez & Mehrabian (1994) on colour psychology

---

## Licence

This project is intended for academic and research purposes only.
