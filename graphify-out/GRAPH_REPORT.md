# Graph Report - anov  (2026-06-24)

## Corpus Check
- 177 files · ~255,014 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2786 nodes · 4902 edges · 118 communities (110 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21666546`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]

## God Nodes (most connected - your core abstractions)
1. `_()` - 487 edges
2. `$()` - 455 edges
3. `cn()` - 223 edges
4. `$()` - 42 edges
5. `L()` - 36 edges
6. `useLanguage()` - 30 edges
7. `slice()` - 23 edges
8. `interpretNode()` - 23 edges
9. `interpretNode()` - 22 edges
10. `Button()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `hashPassword()`  [INFERRED]
  prisma/seed.ts → src/app/api/admin/auth/route.ts
- `GET()` --calls--> `getAdminFromCookies()`  [EXTRACTED]
  src/app/api/admin/gift-cards/route.ts → src/lib/auth.ts
- `PATCH()` --calls--> `getAdminFromCookies()`  [EXTRACTED]
  src/app/api/admin/gift-cards/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getAdminFromCookies()`  [EXTRACTED]
  src/app/api/admin/gift-cards/stats/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getAdminFromCookies()`  [INFERRED]
  src/app/api/admin/reservations/route.ts → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (118 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.00
Nodes (448): Admin, AdminAggregateArgs, AdminAvgAggregateInputType, AdminAvgAggregateOutputType, AdminAvgOrderByAggregateInput, AdminCountAggregateInputType, AdminCountAggregateOutputType, AdminCountArgs (+440 more)

### Community 1 - "Community 1"
Cohesion: 0.01
Nodes (313): AccelerateExtensionFetch, AccelerateExtensionFetchDecorator, Action, ActiveConnectorType, Aggregate, AllModelsToStringIndex, ApplyOmit, Args (+305 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (62): $(), Ad(), ai(), Bp(), Cd(), clone(), _cloneInto(), Dd() (+54 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (64): _(), aa(), as(), Bm(), Bn(), bu(), Cl(), clone() (+56 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (52): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+44 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (64): ac(), addErrorMessage(), addField(), addSuggestion(), ar(), asObject(), Be(), cc() (+56 more)

### Community 6 - "Community 6"
Cohesion: 0.03
Nodes (59): dependencies, class-variance-authority, clsx, cmdk, d3, date-fns, dotenv, embla-carousel-react (+51 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (71): ce(), #a(), aa(), apiKey(), Ba(), cancelAllTransactions(), cl(), cm() (+63 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (41): Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+33 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (48): oe(), addItem(), allocUnsafeSlow(), ao(), Bt(), byteLength(), construct(), dt() (+40 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (44): ac(), addErrorMessage(), addField(), addSuggestion(), asObject(), _c(), cc(), dc() (+36 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (18): $(), a(), F, g, ge(), I(), J(), k() (+10 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (43): addItem(), ae(), append(), At(), bc(), bl(), Bu(), de() (+35 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (13): Badge(), badgeVariants, Checkbox(), HoverCardContent(), InputOTP(), InputOTPGroup(), InputOTPSlot(), Progress() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (30): an(), Bd(), bs(), ds(), Ei(), Ep(), Ge(), Gs() (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (49): _a(), cm(), connect(), Dp(), enumValues(), Fe(), Fi(), fu() (+41 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (42): generate(), Ae(), am(), Bd(), cr(), cu(), ea(), em() (+34 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (16): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+8 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (19): ReservationFormProps, SlotInfo, BoutiqueContent, Button(), Calendar(), Input(), Label(), Popover() (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.19
Nodes (11): useLanguage(), Contact(), ContactContent, Gallery(), History(), MobileCarousel(), PropType, OriginsMap() (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (25): ap(), cp(), es(), Fd(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), getAllQueryCallbacks() (+17 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (36): addMarginSymbol(), afterNextNewline(), compare(), copy(), equals(), fm(), Fr(), G() (+28 more)

### Community 22 - "Community 22"
Cohesion: 0.19
Nodes (23): concat(), de(), ep(), findField(), Gc(), getArgumentName(), getArgumentPath(), getComputedFields() (+15 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (20): N(), rs(), bc(), bs(), cancelAllTransactions(), cs(), disconnect(), Fs() (+12 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (23): build(), commitTransaction(), dispatchEngineSpans(), #f(), fl(), getActiveContext(), getGlobalOmit(), getTraceParent() (+15 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (14): Command(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut(), Dialog() (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (7): { GET, POST }, KeystaticPage, { GET, POST }, components, config, LegalDocumentRenderer(), LegalLanguageNotice()

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (15): AdminReservationsPage(), ALL_SLOTS, ApiResponse, DayInfo, DAYS_FULL, DAYS_SHORT, formatFullDate(), MONTHS_ABBR (+7 more)

### Community 28 - "Community 28"
Cohesion: 0.09
Nodes (24): bo(), build(), dispatchEngineSpans(), e(), ee(), getActiveContext(), getTraceParent(), getTracingHelper() (+16 more)

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 30 - "Community 30"
Cohesion: 0.14
Nodes (20): addMarginSymbol(), afterNextNewline(), br(), getCurrentLineLength(), indent(), J(), renderAllMessages(), ri() (+12 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (16): LanguageContext, LanguageContextValue, Translations, detectBrowserLocale(), getLocaleFromString(), Locale, LOCALE_LABELS, LOCALE_NAMES (+8 more)

### Community 32 - "Community 32"
Cohesion: 0.04
Nodes (45): devDependencies, eslint, eslint-config-next, jsdom, pg, prisma, @prisma/adapter-pg, tailwindcss (+37 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (19): $c(), Di(), el(), Fo(), getLocation(), getPlaceholderValues(), ii(), inputNode() (+11 more)

### Community 34 - "Community 34"
Cohesion: 0.05
Nodes (38): 1.1 Stack, 1.2 Architecture du projet, 1.3 Flux de données, 1. Architecture technique, 2.1 Configuration du stockage, 2.2 Singletons définis, 2.3 Configuration de production, 2. Configuration Keystatic (+30 more)

### Community 35 - "Community 35"
Cohesion: 0.15
Nodes (10): checkIsExpired(), GiftCardCard(), GiftCardCardProps, GiftCardFilters(), GiftCardFiltersProps, GiftCardStatus, GiftCard, GiftCardListResponse (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (8): ClientLayout(), metadata, LanguageProvider(), Footer(), FooterContent, SplashScreen(), SplashScreenProps, Toaster()

### Community 37 - "Community 37"
Cohesion: 0.17
Nodes (7): DropdownMenuCheckboxItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (26): Checklist de validation, Console.log à nettoyer, Estimation de l'effort, Fichiers avec `any` (à corriger), Fichiers de gros volume (>200 lignes), Fichiers identifiés, Global Constraints, Ordre de priorité recommandé (+18 more)

### Community 39 - "Community 39"
Cohesion: 0.11
Nodes (17): 1. Vue d'ensemble, 2. Connexion à l'administration, 3. Modifier le contenu du site, 6. Accéder à la boîte mail (IONOS), 7. Chèques Cadeaux, 8. Contact technique, Ajouter des éléments, Comment modifier un élément (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.17
Nodes (10): Category, Dish, DishCard(), MenuContent(), MenuData, Tab, Tabs(), TabsContent() (+2 more)

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (12): formatCurrency(), formatDate(), formatDateShort(), formatReservationDate(), formatTime(), getPreviousMonday(), isToday(), isInRange() (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (11): addMinutes(), GET(), DELETE(), GET(), Params, PUT(), getAdminFromCookies(), GET() (+3 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (25): alloc(), allocUnsafe(), au(), _d(), destroy(), digest(), digestInto(), dm() (+17 more)

### Community 44 - "Community 44"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 46 - "Community 46"
Cohesion: 0.22
Nodes (9): constructor(), forSql(), Hd(), il(), ji(), nl(), register(), tn() (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (21): append(), bp(), ei(), fp(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), getOrCreate() (+13 more)

### Community 48 - "Community 48"
Cohesion: 0.32
Nodes (10): GET(), buildCoverageMap(), DEFAULT_OPENING_DAYS, DEFAULT_SLOTS, EffectiveConfig, getAvailableSlots(), getEffectiveConfig(), getSlotsWithAvailability() (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.14
Nodes (8): Hero(), HeroProps, ReservationForm(), pickField(), BoutiqueContent, ChequesCadeauxContent(), GiftCardSuccessContent(), GiftCardSuccessContentProps

### Community 50 - "Community 50"
Cohesion: 0.24
Nodes (8): generateGiftCardCode(), POST(), sendConfirmationEmail(), stripe, config, handleGiftCardPayment(), handleReservationPayment(), POST()

### Community 51 - "Community 51"
Cohesion: 0.14
Nodes (13): Commandes du quotidien, `.env.local`, Environnements, Flux d'une feature, `package.json` — scripts, Règles fondamentales, `scripts/vercel-build.js`, Seed idempotent — exemple (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.27
Nodes (7): formatCurrency(), GiftCardStats(), GiftCardStatsProps, GiftCardStatusBadgeProps, statusConfig, GiftCardStats, GiftCardStatus

### Community 54 - "Community 54"
Cohesion: 0.27
Nodes (6): hashPassword(), POST(), SECRET, signAdminToken(), verifyAdminToken(), main()

### Community 55 - "Community 55"
Cohesion: 0.12
Nodes (10): createPrismaClient(), expandEnv(), globalForPrisma, config, path, Prisma, PrismaClient, {
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
} (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.20
Nodes (10): HoveredPoint, OriginsMapProps, PointData, BoutiqueContent, ContactContent, FooterContent, GalleryContent, HeroContent (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.18
Nodes (11): default, default, exports, ./client, ./generator-build, ./package.json, ./sql, default (+3 more)

### Community 58 - "Community 58"
Cohesion: 0.38
Nodes (11): import, import, browser, default, edge-light, node, types, worker (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.38
Nodes (11): require, require, require, browser, default, edge-light, node, types (+3 more)

### Community 60 - "Community 60"
Cohesion: 0.18
Nodes (11): ap(), El(), emit(), handleAndLogRequestError(), handleRequestError(), ip(), op(), pt() (+3 more)

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 62 - "Community 62"
Cohesion: 0.22
Nodes (5): {
  Decimal,
  DbNull,
  JsonNull,
  AnyNull,
  NullTypes,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
}, Prisma, PrismaClient, c(), k()

### Community 63 - "Community 63"
Cohesion: 0.24
Nodes (9): ContactContent, ContentLocalization, GalleryImage, HeroContent, HistoryContent, LegalDocumentContent, MenuContent, ReservationContent (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "Community 65"
Cohesion: 0.29
Nodes (6): Architecture, CLAUDE.md, Common Tasks, Deployment, Key Concepts, Quick Start

### Community 66 - "Community 66"
Cohesion: 0.22
Nodes (8): browser, dependencies, @prisma/client-runtime-utils, main, name, sideEffects, types, version

### Community 67 - "Community 67"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (5): ANØV — Restaurant, Architecture, Déploiement, Développement local, Pages

### Community 69 - "Community 69"
Cohesion: 0.28
Nodes (9): Id(), kd(), kr(), Nd(), Od(), Sa(), Ta(), Xe() (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.50
Nodes (3): ANOV, Commandes de gestion de la base de données, Développement

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (8): child, command, envFileByMode, isPotentialWrite, joinedCommand, MODE_ALIASES, modeArg, writeOps

### Community 72 - "Community 72"
Cohesion: 0.22
Nodes (8): ApiPaginationResponse, ApiResponse, GiftCard, GiftCardActionRequest, GiftCardCreateRequest, Reservation, StripeWebhookEvent, StripeWebhookSession

### Community 73 - "Community 73"
Cohesion: 0.28
Nodes (8): GET(), POST(), sendCancellationEmail(), sendContactConfirmation(), sendContactNotification(), sendReminderEmail(), sendSmsReminder(), GET()

### Community 74 - "Community 74"
Cohesion: 0.25
Nodes (8): ./runtime/client, default, require, default, import, node, require, types

### Community 75 - "Community 75"
Cohesion: 0.25
Nodes (8): imports, #main-entry-point, #wasm-compiler-loader, default, default, edge-light, worker, workerd

### Community 76 - "Community 76"
Cohesion: 0.22
Nodes (9): Am(), Fl(), Gu(), handleAndLogRequestError(), handleRequestError(), sanitizeMessage(), vm(), Xt() (+1 more)

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (7): AdapterInfo, DriverAdapterFactory, Queryable, SqlDriverAdapter, SqlDriverAdapterFactory, SqlQueryable, Transaction

### Community 79 - "Community 79"
Cohesion: 0.29
Nodes (6): Args, Exact, GetRuntimeOutput, Narrowable, Operation, RuntimeName

### Community 80 - "Community 80"
Cohesion: 0.38
Nodes (5): generateAdminGiftCardCode(), GET(), PATCH(), POST(), sendGiftCardEmail()

### Community 81 - "Community 81"
Cohesion: 0.33
Nodes (5): config, Prisma, PrismaClient, {
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
}, empty()

### Community 82 - "Community 82"
Cohesion: 0.33
Nodes (6): Prisma__AdminClient, Prisma__DayOverrideClient, Prisma__GiftCardClient, Prisma__ReservationClient, Prisma__RestaurantSettingsClient, PrismaPromise

### Community 86 - "Community 86"
Cohesion: 0.50
Nodes (3): MODE_ALIASES, resolveAppMode(), resolveEnvFile()

### Community 87 - "Community 87"
Cohesion: 0.40
Nodes (5): default, import, require, types, ./edge

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (5): ./extension, default, import, require, types

### Community 89 - "Community 89"
Cohesion: 0.40
Nodes (5): ./index, default, import, require, types

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (5): ./index-browser, default, import, require, types

### Community 91 - "Community 91"
Cohesion: 0.40
Nodes (5): ./runtime/index-browser, default, import, require, types

### Community 92 - "Community 92"
Cohesion: 0.40
Nodes (5): ./runtime/wasm-compiler-edge, default, import, require, types

### Community 93 - "Community 93"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 94 - "Community 94"
Cohesion: 0.50
Nodes (3): content, emptyFallback, withDefaults

## Knowledge Gaps
- **1131 isolated node(s):** `nextConfig`, `name`, `private`, `version`, `type` (+1126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$()` connect `Community 2` to `Community 0`, `Community 33`, `Community 5`, `Community 69`, `Community 7`, `Community 12`, `Community 76`, `Community 14`, `Community 46`, `Community 16`, `Community 20`, `Community 23`, `Community 55`, `Community 28`, `Community 30`?**
  _High betweenness centrality (0.332) - this node is a cross-community bridge._
- **Why does `$()` connect `Community 11` to `Community 9`, `Community 19`, `Community 23`, `Community 7`?**
  _High betweenness centrality (0.217) - this node is a cross-community bridge._
- **Why does `P()` connect `Community 19` to `Community 11`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `private` to the rest of the system?**
  _1131 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.004454342984409799 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.006369426751592357 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.020050125313283207 - nodes in this community are weakly interconnected._