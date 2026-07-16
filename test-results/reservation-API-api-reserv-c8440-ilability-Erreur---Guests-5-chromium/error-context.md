# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reservation.spec.ts >> API /api/reservations/availability >> Erreur - Guests = 5
- Location: tests/reservation.spec.ts:521:3

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:3000
Call log:
  - → GET http://localhost:3000/api/reservations/availability?date=2026-11-12&guests=5
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```