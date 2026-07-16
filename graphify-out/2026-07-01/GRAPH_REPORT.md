# Graph Report - . (2026-06-25)

## Corpus Check

- 35 files · ~272,804 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 832 nodes · 875 edges · 43 communities (31 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 70,678 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Frontend Layout Components|Frontend Layout Components]]
- [[_COMMUNITY_Reservation System|Reservation System]]
- [[_COMMUNITY_Gift Card Payment|Gift Card Payment]]
- [[_COMMUNITY_Contact Form|Contact Form]]
- [[_COMMUNITY_CMS Configuration|CMS Configuration]]
- [[_COMMUNITY_Test Infrastructure|Test Infrastructure]]
- [[_COMMUNITY_API Endpoints|API Endpoints]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Email Integration|Email Integration]]
- [[_COMMUNITY_Menu Content|Menu Content]]
- [[_COMMUNITY_Page Navigation|Page Navigation]]
- [[_COMMUNITY_Database Schema|Database Schema]]
- [[_COMMUNITY_Localization|Localization]]
- [[_COMMUNITY_Footer Content|Footer Content]]
- [[_COMMUNITY_Hero Content|Hero Content]]
- [[_COMMUNITY_Gallery|Gallery]]
- [[_COMMUNITY_History Section|History Section]]
- [[_COMMUNITY_Origins Map|Origins Map]]
- [[_COMMUNITY_Navigation Menu|Navigation Menu]]
- [[_COMMUNITY_Language Selector|Language Selector]]
- [[_COMMUNITY_Admin Interface|Admin Interface]]
- [[_COMMUNITY_Gift Card Admin|Gift Card Admin]]
- [[_COMMUNITY_Webhook Processing|Webhook Processing]]
- [[_COMMUNITY_Reservation Actions|Reservation Actions]]
- [[_COMMUNITY_Content Management|Content Management]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Utils|Utils]]
- [[_COMMUNITY_Middleware|Middleware]]
- [[_COMMUNITY_Error Handling|Error Handling]]
- [[_COMMUNITY_Cache|Cache]]
- [[_COMMUNITY_Constants|Constants]]
- [[_COMMUNITY_Migration|Migration]]
- [[_COMMUNITY_Documentation|Documentation]]
- [[_COMMUNITY_Playwright Test|Playwright Test]]
- [[_COMMUNITY_API Routes|API Routes]]
- [[_COMMUNITY_Payment|Payment]]
- [[_COMMUNITY_Security|Security]]

## God Nodes (most connected - your core abstractions)

1. `exports` - 15 edges
2. `scripts` - 11 edges
3. `Keystatic Configuration` - 11 edges
4. `getTransporter()` - 8 edges
5. `require` - 7 edges
6. `import` - 7 edges
7. `require` - 7 edges
8. `import` - 7 edges
9. `require` - 7 edges
10. `import` - 7 edges

## Surprising Connections (you probably didn't know these)

- `Language Selector` ----> `Multilingual Support` [EXTRACTED]
  tests/homepage.spec.ts → docs/draft.md
- `PATCH()` --calls--> `sendCancellationEmail()` [INFERRED]
  src/app/api/admin/reservations/route.ts → src/lib/email.ts
- `GET()` --calls--> `sendReminderEmail()` [EXTRACTED]
  src/app/api/cron/reminders/route.ts → src/lib/email.ts
- `POST()` --calls--> `sendConfirmationEmail()` [EXTRACTED]
  src/app/api/test-email/route.ts → src/lib/email.ts
- `handleGiftCardPayment()` --calls--> `sendGiftCardEmail()` [EXTRACTED]
  src/app/api/stripe/webhook/route.ts → src/lib/email.ts

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **** — function:getMailcatcherEmails, function:clearMailcatcherEmails, function:waitForEmailWithSubject [INFERRED]
- **** — page:home, component:hero-section, component:history-section, component:origins-map, component:contact-section [INFERRED]
- **** — config:keystatic-config, singleton:hero, singleton:histoire, singleton:origines, singleton:galerie, singleton:contact, singleton:menu, singleton:footer [INFERRED]
- **** — concept:anov-restaurant, concept:single-page-site, concept:contact-form, concept:keystatic-cms, concept:admin-interface, concept:gift-card-system, concept:reservation-system [INFERRED]
- **** — concept:multilingual, concept:multilingual-content, component:language-selector [INFERRED]
- **** — config:playwright-baseurl, page:home, page:menu, page:contact [INFERRED]
- **** — component:contact-form, component:email-validator, api:mailcatcher-messages, api:mailcatcher-delete, api:mailcatcher-messages-id [INFERRED]
- **** — singleton:menu, content:menu.yaml, component:menu-tabs, component:dish-card [INFERRED]

## Communities (43 total, 12 thin omitted)

### Community 0 - "Frontend Layout Components"

Cohesion: 0.00
Nodes (448): Admin, AdminAggregateArgs, AdminAvgAggregateInputType, AdminAvgAggregateOutputType, AdminAvgOrderByAggregateInput, AdminCountAggregateInputType, AdminCountAggregateOutputType, AdminCountArgs (+440 more)

### Community 1 - "Reservation System"

Cohesion: 0.03
Nodes (60): dependencies, class-variance-authority, clsx, cmdk, d3, date-fns, dotenv, embla-carousel-react (+52 more)

### Community 2 - "Gift Card Payment"

Cohesion: 0.04
Nodes (48): devDependencies, eslint, eslint-config-next, jsdom, pg, @playwright/test, prisma, @prisma/adapter-pg (+40 more)

### Community 3 - "Contact Form"

Cohesion: 0.07
Nodes (29): Mailcatcher DELETE /messages API, Mailcatcher /messages API, Mailcatcher /messages/{id}.html API, Contact Form, Contact Section, Dish Card, Email Validator, Footer (+21 more)

### Community 4 - "CMS Configuration"

Cohesion: 0.10
Nodes (27): browser, import, dependencies, @prisma/client-runtime-utils, import, browser, default, edge-light (+19 more)

### Community 5 - "Test Infrastructure"

Cohesion: 0.09
Nodes (12): Multilingual Content Fields, Keystatic Configuration, Boutique Singleton, Contact Singleton, Footer Singleton, Galerie Singleton, Gift Card Success Singleton, Hero Singleton (+4 more)

### Community 6 - "API Endpoints"

Cohesion: 0.18
Nodes (16): createTransporter(), generateICS(), getTransporter(), sendCancellationEmail(), sendConfirmationEmail(), sendContactConfirmation(), sendContactNotification(), sendGiftCardEmail() (+8 more)

### Community 7 - "Authentication"

Cohesion: 0.10
Nodes (13): ALL_SLOTS, ApiResponse, DayInfo, DAYS_FULL, DAYS_SHORT, MONTHS_ABBR, MONTHS_FULL, ReservationRow (+5 more)

### Community 8 - "Email Integration"

Cohesion: 0.14
Nodes (8): ReservationFormProps, SlotInfo, TranslationData, de, en, fr, Calendar(), getLocale()

### Community 9 - "Menu Content"

Cohesion: 0.33
Nodes (9): buildCoverageMap(), DEFAULT_OPENING_DAYS, DEFAULT_SLOTS, EffectiveConfig, getAvailableSlots(), getEffectiveConfig(), getSlotsWithAvailability(), getUnavailableDatesForMonth() (+1 more)

### Community 10 - "Page Navigation"

Cohesion: 0.20
Nodes (10): default, default, exports, ./client, ./package.json, ./runtime/index-browser, default, import (+2 more)

### Community 11 - "Database Schema"

Cohesion: 0.50
Nodes (9): require, require, require, browser, default, edge-light, node, worker (+1 more)

### Community 12 - "Localization"

Cohesion: 0.25
Nodes (8): Admin Interface, l'Anøv Restaurant, Contact Form, Gift Card System, Keystatic CMS, Mailcatcher, Reservation System, Single Page Site (Landing + Menu)

### Community 13 - "Footer Content"

Cohesion: 0.25
Nodes (8): ./runtime/client, default, require, default, import, node, require, types

### Community 14 - "Hero Content"

Cohesion: 0.33
Nodes (5): config, path, Prisma, PrismaClient, {
PrismaClientKnownRequestError,
PrismaClientUnknownRequestError,
PrismaClientRustPanicError,
PrismaClientInitializationError,
PrismaClientValidationError,
getPrismaClient,
sqltag,
empty,
join,
raw,
skip,
Decimal,
Debug,
DbNull,
JsonNull,
AnyNull,
NullTypes,
makeStrictEnum,
Extensions,
warnOnce,
defineDmmfProperty,
Public,
getRuntime,
createParam,
}

### Community 15 - "Gallery"

Cohesion: 0.33
Nodes (6): Prisma__AdminClient, Prisma__DayOverrideClient, Prisma__GiftCardClient, Prisma__ReservationClient, Prisma__RestaurantSettingsClient, PrismaPromise

### Community 16 - "History Section"

Cohesion: 0.40
Nodes (4): config, Prisma, PrismaClient, {
PrismaClientKnownRequestError,
PrismaClientUnknownRequestError,
PrismaClientRustPanicError,
PrismaClientInitializationError,
PrismaClientValidationError,
getPrismaClient,
sqltag,
empty,
join,
raw,
skip,
Decimal,
Debug,
DbNull,
JsonNull,
AnyNull,
NullTypes,
makeStrictEnum,
Extensions,
warnOnce,
defineDmmfProperty,
Public,
getRuntime,
createParam,
}

### Community 17 - "Origins Map"

Cohesion: 0.40
Nodes (3): {
Decimal,
DbNull,
JsonNull,
AnyNull,
NullTypes,
makeStrictEnum,
Public,
getRuntime,
skip
}, Prisma, PrismaClient

### Community 18 - "Navigation Menu"

Cohesion: 0.40
Nodes (5): default, import, require, types, ./edge

### Community 19 - "Language Selector"

Cohesion: 0.40
Nodes (5): ./extension, default, import, require, types

### Community 20 - "Admin Interface"

Cohesion: 0.40
Nodes (5): ./index, default, import, require, types

### Community 21 - "Gift Card Admin"

Cohesion: 0.40
Nodes (5): ./index-browser, default, import, require, types

### Community 22 - "Webhook Processing"

Cohesion: 0.40
Nodes (5): ./runtime/wasm-compiler-edge, default, import, require, types

### Community 23 - "Reservation Actions"

Cohesion: 0.50
Nodes (4): ./generator-build, default, import, require

### Community 24 - "Content Management"

Cohesion: 0.50
Nodes (4): ./sql, types, default, require

## Knowledge Gaps

- **660 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+655 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Reservation System` to `Gift Card Payment`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `exports` connect `Page Navigation` to `CMS Configuration`, `Database Schema`, `Footer Content`, `Navigation Menu`, `Language Selector`, `Admin Interface`, `Gift Card Admin`, `Webhook Processing`, `Reservation Actions`, `Content Management`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _660 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.004454342984409799 - nodes in this community are weakly interconnected._
- **Should `Reservation System` be split into smaller, more focused modules?**
  _Cohesion score 0.03333333333333333 - nodes in this community are weakly interconnected._
- **Should `Gift Card Payment` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Contact Form` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
