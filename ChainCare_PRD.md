# ChainCare — Product Requirements Document (PRD)
**Version:** 1.0  
**Date:** April 2026  
**Author:** Athrva  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Tech Stack](#4-tech-stack)
5. [System Roles & Permissions (RBAC)](#5-system-roles--permissions-rbac)
6. [Complete System Workflow](#6-complete-system-workflow)
7. [Feature Specifications](#7-feature-specifications)
8. [ML Feature — Donation Hotspot Detection](#8-ml-feature--donation-hotspot-detection)
9. [Database Schema](#9-database-schema)
10. [API Endpoints](#10-api-endpoints)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Future Scope](#12-future-scope)

---

## 1. Executive Summary

**ChainCare** is a transparent, role-based donation management platform that ensures funds reach verified beneficiaries through accountability workflows, real-time fund tracking, and data-driven ML insights. It addresses the broken trust model in traditional charity platforms by enforcing admin approval gates, tracing every transaction, and surfacing donation hotspots to guide resource allocation.

---

## 2. Problem Statement

| Problem | Impact |
|---|---|
| Donors don't know where their money goes | Low trust, low repeat donations |
| No verification of beneficiaries | Fraudulent campaigns proliferate |
| Manual or no tracking of fund usage | Zero accountability post-donation |
| No data on where help is needed most | Misdirected charity efforts |

---

## 3. Goals & Success Metrics

### Primary Goals
- Verified, fraud-resistant campaign creation
- Real-time, traceable donation tracking
- Role-enforced access control (RBAC)
- ML-powered hotspot detection for admin decision support

### Success Metrics

| Metric | Target |
|---|---|
| Campaign approval turnaround | < 24 hours |
| Donation traceability rate | 100% |
| Unauthorized access incidents | 0 |
| ML hotspot prediction accuracy | ≥ 80% (F1 score) |
| API response time (P95) | < 300ms |

---

## 4. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + Vite | SPA UI for all roles |
| **UI Library** | Tailwind CSS + shadcn/ui | Component styling |
| **State Management** | Zustand | Global auth + UI state |
| **Backend** | FastAPI (Python) | REST API + business logic |
| **ORM** | SQLAlchemy | DB model management |
| **Database** | PostgreSQL | Primary data store |
| **Auth** | JWT (python-jose) | Stateless authentication |
| **ML** | scikit-learn + pandas | Hotspot detection model |
| **ML Serving** | FastAPI ML router | Integrated inference endpoint |
| **Deployment** | Docker + Render / Railway | Containerized deployment |

---

## 5. System Roles & Permissions (RBAC)

### Roles Overview

| Role | Who They Are | Core Responsibility |
|---|---|---|
| **Donor** | General public user | Browse campaigns, donate money |
| **Beneficiary** | NGO / individual in need | Create and manage campaigns |
| **Field Worker** | Local auditor / NGO staff | Verify on-ground reality of campaigns |
| **Admin** | Platform operator | Approve campaigns, assign field workers, view analytics |

### Permission Matrix

| Action | Donor | Beneficiary | Field Worker | Admin |
|---|---|---|---|---|
| Register / Login | ✅ | ✅ | ✅ | ✅ |
| Browse approved campaigns | ✅ | ✅ | ✅ | ✅ |
| Create campaign | ❌ | ✅ | ❌ | ❌ |
| Donate to campaign | ✅ | ❌ | ❌ | ❌ |
| Assign field worker | ❌ | ❌ | ❌ | ✅ |
| Submit verification report | ❌ | ❌ | ✅ | ❌ |
| Approve / reject campaigns | ❌ | ❌ | ❌ | ✅ |
| Access ML hotspot dashboard | ❌ | ❌ | ❌ | ✅ |

---

## 6. Complete System Workflow

### 6.1 User Registration & Authentication Flow

```
[User] --> Register (name, email, password, role)
              |
              v
        [POST /auth/register]
              |
              v
        Hash password (bcrypt)
        Store user in DB
              |
              v
        [POST /auth/login]
              |
              v
        Validate credentials
        Issue JWT (contains: user_id, role, exp)
              |
              v
        [Frontend stores JWT in memory / httpOnly cookie]
              |
              v
        All subsequent requests: Authorization: Bearer <token>
```

---

### 6.2 Beneficiary — Campaign Creation Flow

```
[Beneficiary Logged In]
        |
        v
Fill Campaign Form:
  - Title
  - Description
  - Category (Education / Health / Disaster / Food / etc.)
  - Target Amount
  - Location (City, State, Country)
  - Start Date / End Date
        |
        v
[POST /campaigns/create]
        |
        v
Backend validates:
  - Role == beneficiary
  - Required fields present
  - end_date > start_date
        |
        v
Campaign stored in DB:
  status = "pending"
  raised_amount = 0
        |
        v
[Admin notified — campaign appears in Admin queue]
```

---

### 6.3 Admin — Campaign Review Flow

```
[Admin Dashboard]
        |
        v
View all campaigns with status = "pending"
        |
        v
Select campaign → Review details
        |
        v
Decision:
  ┌─── APPROVE ──────────────────────┐
  │  PUT /admin/campaigns/{id}/approve│
  │  status = "active"               │
  │  Campaign visible to donors       │
  └───────────────────────────────────┘
        OR
  ┌─── REJECT ───────────────────────┐
  │  PUT /admin/campaigns/{id}/reject │
  │  status = "rejected"             │
  │  Rejection reason stored          │
  └───────────────────────────────────┘
```

---

### 6.4 Donor — Donation Flow

```
[Donor Logged In]
        |
        v
Browse active campaigns (filter by category, location, target)
        |
        v
Select Campaign → View details:
  - raised_amount / target_amount
  - Beneficiary info
  - Campaign description
        |
        v
Enter donation amount
        |
        v
[POST /donations/create]
  {campaign_id, amount}
        |
        v
Backend validates:
  - Role == donor
  - campaign.status == "active"
  - amount > 0
        |
        v
DB Updates (atomic transaction):
  1. Insert into donations table
  2. campaigns.raised_amount += amount
        |
        v
Response: donation_id, updated raised_amount
        |
        v
[Donor sees updated progress bar in real-time]
        |
        v
If raised_amount >= target_amount:
  campaign.status = "completed"
```

---

### 6.5 Admin — ML Hotspot Detection Flow

```
[Admin clicks "Hotspot Analysis" in Dashboard]
        |
        v
[GET /admin/ml/hotspots]
        |
        v
Backend fetches donation + campaign data from DB
        |
        v
Feature engineering:
  - Donations per region
  - Avg donation gap (days since last donation)
  - Campaign fulfillment ratio per category
  - Donor count per region
        |
        v
ML Model (Random Forest / Gradient Boosting):
  Predict: hotspot_score (0.0 – 1.0) per region+category
        |
        v
Response:
  [
    { region: "Mumbai", category: "Health", hotspot_score: 0.91 },
    { region: "Bihar", category: "Education", hotspot_score: 0.88 },
    ...
  ]
        |
        v
React renders:
  - Heatmap (react-leaflet / recharts)
  - Ranked table of underserved region+category pairs
  - Recommended campaign categories to promote
```

---

### 6.6 Full End-to-End Sequence Diagram

```
Donor          Beneficiary        Admin           Backend (FastAPI)       DB
  |                 |               |                    |                 |
  |                 |-- POST /campaigns/create --------> |                 |
  |                 |               |                    |-- INSERT ------> |
  |                 |               |                    |   status=pending |
  |                 |               |<--- Admin sees ----|                 |
  |                 |               |-- PUT /approve --> |                 |
  |                 |               |                    |-- UPDATE ------> |
  |                 |               |                    |   status=active  |
  |-- GET /campaigns (active) ----->|                    |                 |
  |<------- campaign list ----------|                    |                 |
  |                 |               |                    |                 |
  |-- POST /donations/create ------>|                    |                 |
  |                 |               |                    |-- INSERT ------> |
  |                 |               |                    |-- UPDATE raised->|
  |<-- donation_id, raised_amount --|                    |                 |
  |                 |               |-- GET /ml/hotspots>|                 |
  |                 |               |                    |-- ML inference   |
  |                 |               |<-- hotspot_data ---|                 |
```

---

### 6.7 Field Worker — On-Ground Verification Flow

```
[Admin Dashboard]
        |
        v
Select pending/active campaign → Assign Field Worker
        |
        v
[Field Worker Dashboard]
        |
        v
View "Assigned Verifications" queue
        |
        v
Visit on-ground site → Fill Verification Report:
  - Findings (Text)
  - Recommendation (Approve/Flag/Reject)
  - Photo Evidence (URL)
        |
        v
[POST /verifications/]
        |
        v
[Admin Dashboard — Reports updated]
        |
        v
Admin makes final disbursement decision based on report
```

### 6.8 Beneficiary — Direct Aid Request Flow (Personal Assistance)

```
[Beneficiary Dash / Request Page]
        |
        v
Fill Short Request Form:
  - Title
  - Category
  - Location
  - Description (Detailed need)
  - Image Evidence (Poverty proof / medical cert)
        |
        v
[POST /aid-requests/]
        |
        v
[Admin Dashboard — Verification Queue]
        |
        v
Admin Review (Verify document authenticity)
        |
        v
Admin Status Update: Verify / Reject
        |
        v
If Verified: Request is flagged for potential conversion into full Campaign
```

---

## 7. Feature Specifications

### 7.1 Authentication Module

**Endpoints:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me`

| Field | Details |
|---|---|
| Password hashing | bcrypt via passlib |
| Token | JWT HS256, expiry 24h |
| Role enforcement | FastAPI `Depends()` with role check decorator |

**JWT Payload:**
```json
{
  "sub": "user_id",
  "role": "donor | beneficiary | admin",
  "exp": 1714000000
}
```

---

### 7.2 Campaign Module

**Endpoints:** `POST /campaigns`, `GET /campaigns`, `GET /campaigns/{id}`, `PUT /campaigns/{id}` (beneficiary), `PUT /admin/campaigns/{id}/approve`, `PUT /admin/campaigns/{id}/reject`

**Campaign Status Lifecycle:**
```
pending → active → completed
            └────→ rejected
```

---

### 7.3 Donation Module

**Endpoints:** `POST /donations`, `GET /donations/mine`, `GET /admin/donations`

- Every donation is atomic: donation insert + `raised_amount` update in one DB transaction.
- Donors can view full history of their donations with campaign name, amount, date.

---

### 7.4 Admin Dashboard

**Endpoints:** `GET /admin/campaigns?status=pending`, `GET /admin/users`, `GET /admin/stats`, `GET /admin/ml/hotspots`

- Platform stats: total campaigns, total raised, active donors, pending approvals.
- Full user management: view roles, deactivate accounts.

---

## 8. ML Feature — Donation Hotspot Detection

### 8.1 Problem

Admins have no insight into **which region + category combinations are critically underfunded** relative to need. Without this, campaign promotion is blind.

### 8.2 Definition of a "Hotspot"

A hotspot is a `(region, category)` pair that is:
- High in **need** (many campaigns, high targets)
- Low in **funding** (low raised amounts, low donor engagement)

### 8.3 Model Approach

**Algorithm:** Random Forest Classifier (binary: hotspot = 1, not hotspot = 0)  
**Alternative:** Gradient Boosting (XGBoost) for better performance on tabular data  
**Output:** Hotspot probability score (0.0 – 1.0)

---

### 8.4 Training Dataset — Required Columns

The model is trained on aggregated donation + campaign data. Each row represents a `(region, category, time_window)` aggregate.

#### Primary Feature Table: `ml_hotspot_features`

| Column Name | Type | Description |
|---|---|---|
| `region` | string | City or state name (e.g., "Mumbai", "Bihar") |
| `category` | string | Campaign category (Education, Health, etc.) |
| `time_window` | date | Month-year of aggregation (e.g., 2026-03) |
| `total_campaigns` | int | Total campaigns created in region+category |
| `active_campaigns` | int | Currently active campaigns |
| `total_target_amount` | float | Sum of target amounts across campaigns |
| `total_raised_amount` | float | Sum of actual raised amounts |
| `fulfillment_ratio` | float | `total_raised / total_target` (0.0–1.0) |
| `total_donations` | int | Count of individual donations made |
| `unique_donors` | int | Count of distinct donors |
| `avg_donation_amount` | float | Mean donation amount |
| `avg_days_since_last_donation` | float | Recency — higher = less active |
| `donor_retention_rate` | float | % donors who donated more than once |
| `campaign_rejection_rate` | float | % campaigns rejected by admin |
| `population_index` | float | Relative population weight (from census/mock) |
| `poverty_index` | float | Socioeconomic need indicator (0.0–1.0, external source) |
| **`is_hotspot`** | **int** | **Target label: 1 = hotspot, 0 = not hotspot** |

#### Labeling Strategy for `is_hotspot`
```
is_hotspot = 1  if:
  fulfillment_ratio < 0.3   AND
  total_campaigns >= 3      AND
  avg_days_since_last_donation > 14

is_hotspot = 0  otherwise
```

---

### 8.5 Feature Engineering (in Python)

```python
# Derived features computed before model training

df["fulfillment_ratio"] = df["total_raised_amount"] / df["total_target_amount"]
df["donation_density"] = df["total_donations"] / df["total_campaigns"]
df["need_gap"] = df["total_target_amount"] - df["total_raised_amount"]
df["engagement_score"] = df["unique_donors"] / df["total_campaigns"]
df["recency_penalty"] = df["avg_days_since_last_donation"] / 30  # normalize to months
```

---

### 8.6 Model Training Pipeline

```python
# model/train.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score
import joblib

FEATURES = [
    "total_campaigns", "active_campaigns", "fulfillment_ratio",
    "total_donations", "unique_donors", "avg_donation_amount",
    "avg_days_since_last_donation", "donor_retention_rate",
    "donation_density", "need_gap", "engagement_score",
    "recency_penalty", "population_index", "poverty_index"
]
TARGET = "is_hotspot"

df = pd.read_csv("hotspot_training_data.csv")

# Encode category
le = LabelEncoder()
df["category_enc"] = le.fit_transform(df["category"])
FEATURES.append("category_enc")

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.05)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))

joblib.dump(model, "hotspot_model.pkl")
joblib.dump(le, "category_encoder.pkl")
```

---

### 8.7 Inference API

```python
# routers/ml.py  (FastAPI)

@router.get("/admin/ml/hotspots")
async def get_hotspots(db: Session = Depends(get_db), admin=Depends(require_admin)):
    # 1. Aggregate data from DB
    raw_data = aggregate_hotspot_features(db)
    df = pd.DataFrame(raw_data)
    
    # 2. Feature engineering
    df = engineer_features(df)
    
    # 3. Load model
    model = joblib.load("hotspot_model.pkl")
    
    # 4. Predict
    df["hotspot_score"] = model.predict_proba(df[FEATURES])[:, 1]
    
    # 5. Return top hotspots
    results = (
        df[["region", "category", "hotspot_score", "fulfillment_ratio", "need_gap"]]
        .sort_values("hotspot_score", ascending=False)
        .head(20)
        .to_dict(orient="records")
    )
    return {"hotspots": results}
```

---

### 8.8 React Frontend — Hotspot Dashboard

**Components:**
- `HotspotHeatmap.jsx` — recharts `ScatterChart` or react-leaflet choropleth map
- `HotspotTable.jsx` — ranked table: region, category, score, fulfillment ratio, need gap
- `HotspotFilters.jsx` — filter by category, min score threshold

**Sample UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🔥 Donation Hotspot Dashboard           [Refresh]      │
├────────────────────────┬────────────────────────────────┤
│                        │  Top Underserved Regions       │
│   [Heatmap / Chart]    │  1. Bihar – Education   0.91   │
│                        │  2. UP – Health         0.87   │
│                        │  3. Odisha – Food       0.83   │
├────────────────────────┴────────────────────────────────┤
│  [Filter: Category ▼]  [Min Score: 0.7 ▼]              │
│                                                         │
│  Recommended Action: Promote campaigns in Bihar/Edu     │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Database Schema

### users
```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,   -- bcrypt hash
    role        VARCHAR(20) NOT NULL CHECK (role IN ('donor','beneficiary','admin')),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### campaigns
```sql
CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id  UUID REFERENCES users(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    category        VARCHAR(50) NOT NULL,  -- Education, Health, Disaster, Food, Other
    target_amount   DECIMAL(12,2) NOT NULL,
    raised_amount   DECIMAL(12,2) DEFAULT 0,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'India',
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','active','rejected','completed')),
    rejection_reason TEXT,
    start_date      DATE,
    end_date        DATE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### donations
```sql
CREATE TABLE donations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id    UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### verification_reports
```sql
CREATE TABLE verification_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id     UUID REFERENCES campaigns(id),
    field_worker_id UUID REFERENCES users(id),
    status          VARCHAR(20),  -- verified, flagged, rejected
    findings        TEXT,
    recommendation  TEXT,
    image_url       VARCHAR(255),
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### ml_hotspot_snapshots *(for training data generation)*
```sql
CREATE TABLE ml_hotspot_snapshots (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region                      VARCHAR(100),
    category                    VARCHAR(50),
    time_window                 DATE,
    total_campaigns             INT,
    active_campaigns            INT,
    total_target_amount         DECIMAL(14,2),
    total_raised_amount         DECIMAL(14,2),
    fulfillment_ratio           FLOAT,
    total_donations             INT,
    unique_donors               INT,
    avg_donation_amount         FLOAT,
    avg_days_since_last_donation FLOAT,
    donor_retention_rate        FLOAT,
    campaign_rejection_rate     FLOAT,
    population_index            FLOAT,
    poverty_index               FLOAT,
    is_hotspot                  SMALLINT,    -- 1 or 0 (computed label)
    snapshot_created_at         TIMESTAMP DEFAULT NOW()
);
```

---

## 10. API Endpoints

### Auth
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login, get JWT |
| GET | `/auth/me` | All | Get current user profile |

### Campaigns
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/campaigns` | Beneficiary | Create campaign |
| GET | `/campaigns` | All | List active campaigns (filters: category, location) |
| GET | `/campaigns/{id}` | All | Get campaign details |
| PUT | `/campaigns/{id}` | Beneficiary (owner) | Edit pending campaign |
| GET | `/beneficiary/campaigns` | Beneficiary | My campaigns |

### Admin — Campaigns
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/admin/campaigns` | Admin | List all campaigns (filter by status) |
| PUT | `/admin/campaigns/{id}/approve` | Admin | Approve campaign |
| PUT | `/admin/campaigns/{id}/reject` | Admin | Reject campaign with reason |

### Donations
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/donations` | Donor | Create donation |
| GET | `/donations/mine` | Donor | My donation history |
| GET | `/admin/donations` | Admin | All donations |

### Verifications
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/verifications` | Field Worker | Submit verification report |
| GET | `/verifications/all` | Admin | Review all reports |
| GET | `/campaigns/assigned`| Field Worker | Get assigned tasks |

### Admin — Analytics & ML
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Platform-wide statistics |
| GET | `/admin/ml/hotspots` | Admin | ML hotspot predictions |
| POST | `/admin/ml/retrain` | Admin | Trigger model retraining |

---

## 11. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | All admin/role endpoints protected via JWT + role check middleware |
| **Security** | Passwords hashed with bcrypt (min cost=12) |
| **Security** | CORS restricted to known frontend origin |
| **Performance** | API P95 latency < 300ms |
| **Performance** | ML inference < 2 seconds (batch aggregation) |
| **Reliability** | DB transactions for donation + raised_amount update (ACID) |
| **Scalability** | Stateless FastAPI allows horizontal scaling |
| **Data Integrity** | `raised_amount` never manually set — only updated via donation endpoint |
| **Auditability** | All donations have `created_at` + `donor_id` immutably stored |

---

## 12. Future Scope

| Feature | Description |
|---|---|
| **Payment Gateway** | Razorpay / Stripe integration for real money movement |
| **Blockchain Layer** | Store donation hashes on-chain (Ethereum / Polygon) for immutability |
| **NGO Verification** | Gov ID / document upload + verification pipeline |
| **Fraud Detection ML** | Detect suspicious donation patterns (bots, money cycling) |
| **Email Notifications** | Nodemailer / SendGrid for approval, donation confirmation |
| **Public Transparency Page** | Unauthenticated dashboard showing fund flow per campaign |
| **Mobile App** | React Native wrapper for donor on-the-go giving |
| **Audit Logs** | Append-only log table for every admin action |

---

*ChainCare PRD v1.0 — Built for transparency, accountability, and data-driven charity.*
