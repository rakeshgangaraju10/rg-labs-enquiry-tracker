-- How the enquiries would be stored in a real database (PostgreSQL),
-- the planned next step after browser storage.

CREATE TABLE enquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  business    TEXT NOT NULL,
  phone       CHAR(10) NOT NULL,
  service     TEXT NOT NULL,
  budget      INTEGER NOT NULL DEFAULT 0 CHECK (budget >= 0),
  status      TEXT NOT NULL DEFAULT 'New'
              CHECK (status IN ('New', 'Contacted', 'Quoted', 'Won', 'Lost')),
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Speeds up the stage filter.
CREATE INDEX idx_enquiries_status ON enquiries (status);

-- The summary line on the page: value and count of open enquiries.
SELECT COUNT(*) AS open_count, COALESCE(SUM(budget), 0) AS open_value
FROM enquiries
WHERE status NOT IN ('Won', 'Lost');

-- Enquiries per stage (the numbers on the filter buttons).
SELECT status, COUNT(*) AS total
FROM enquiries
GROUP BY status;

-- Search by name or business, newest first.
SELECT *
FROM enquiries
WHERE name ILIKE '%bakery%' OR business ILIKE '%bakery%'
ORDER BY created_at DESC;
