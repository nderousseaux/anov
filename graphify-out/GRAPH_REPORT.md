# Graph Report - .  (2026-06-21)

## Corpus Check
- 194 files · ~253,963 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2660 nodes · 4755 edges · 115 communities (108 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]

## God Nodes (most connected - your core abstractions)
1. `_()` - 487 edges
2. `$()` - 455 edges
3. `cn()` - 223 edges
4. `$()` - 42 edges
5. `L()` - 36 edges
6. `useLanguage()` - 28 edges
7. `slice()` - 23 edges
8. `interpretNode()` - 23 edges
9. `interpretNode()` - 22 edges
10. `from()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `hashPassword()`  [INFERRED]
  prisma/seed.ts → src/app/api/admin/auth/route.ts
- `GET()` --calls--> `getAdminFromCookies()`  [EXTRACTED]
  src/app/api/admin/gift-cards/route.ts → src/lib/auth.ts
- `PATCH()` --calls--> `getAdminFromCookies()`  [EXTRACTED]
  src/app/api/admin/gift-cards/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getAdminFromCookies()`  [INFERRED]
  src/app/api/admin/reservations/route.ts → src/lib/auth.ts
- `PATCH()` --calls--> `getAdminFromCookies()`  [INFERRED]
  src/app/api/admin/reservations/route.ts → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (115 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.00
Nodes (448): Admin, AdminAggregateArgs, AdminAvgAggregateInputType, AdminAvgAggregateOutputType, AdminAvgOrderByAggregateInput, AdminCountAggregateInputType, AdminCountAggregateOutputType, AdminCountArgs (+440 more)

### Community 1 - "Community 1"
Cohesion: 0.01
Nodes (313): AccelerateExtensionFetch, AccelerateExtensionFetchDecorator, Action, ActiveConnectorType, Aggregate, AllModelsToStringIndex, ApplyOmit, Args (+305 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (48): $(), ai(), Bp(), clone(), _cloneInto(), cm(), dm(), Dp() (+40 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (38): _(), aa(), Bm(), bs(), bu(), clone(), _cloneInto(), constructor() (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (59): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+51 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (65): ac(), addErrorMessage(), addField(), addSuggestion(), ar(), asObject(), Be(), cc() (+57 more)

### Community 6 - "Community 6"
Cohesion: 0.03
Nodes (59): dependencies, class-variance-authority, clsx, cmdk, d3, date-fns, dotenv, embla-carousel-react (+51 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (55): _a(), Ae(), cm(), connect(), dm(), Dp(), ea(), enumValues() (+47 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (53): ce(), #a(), apiKey(), cl(), commitTransaction(), connect(), Da(), deserialize() (+45 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (52): addItem(), allocUnsafeSlow(), am(), Bt(), byteLength(), concat(), construct(), de() (+44 more)

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (41): Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+33 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (45): ac(), addErrorMessage(), addField(), addSuggestion(), asObject(), _c(), cc(), dc() (+37 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (19): $(), a(), F, g, ge(), I(), J(), k() (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): ContactContent, SlotInfo, BoutiqueContent, Reservation, Button(), Input(), Label(), Popover() (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (20): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, Checkbox(), DrawerContent() (+12 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (37): oe(), alloc(), allocUnsafe(), ao(), au(), _d(), destroy(), digest() (+29 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (36): Ba(), Bd(), bs(), Dd(), Ei(), Ep(), Gs(), H() (+28 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (31): N(), rs(), bc(), cancelAllTransactions(), cs(), disconnect(), execute(), get() (+23 more)

### Community 18 - "Community 18"
Cohesion: 0.08
Nodes (31): bl(), br(), Bu(), en(), fm(), fromContent(), Gd(), highlight() (+23 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (19): Hero(), HeroProps, useLanguage(), Contact(), Gallery(), History(), MobileCarousel(), PropType (+11 more)

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (27): addMarginSymbol(), afterNextNewline(), compare(), copy(), G(), getCurrentLineLength(), hc(), indent() (+19 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (18): LanguageContext, LanguageContextValue, LanguageProvider(), Translations, LanguageSelector(), detectBrowserLocale(), getLocaleFromString(), Locale (+10 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (24): bo(), build(), dispatchEngineSpans(), e(), ee(), getActiveContext(), getTraceParent(), getTracingHelper() (+16 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (17): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+9 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (23): append(), bp(), ei(), fp(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), getAllQueryCallbacks() (+15 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (23): build(), commitTransaction(), dispatchEngineSpans(), #f(), fl(), getActiveContext(), getGlobalOmit(), getTraceParent() (+15 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (14): Command(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut(), Dialog() (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (7): { GET, POST }, KeystaticPage, { GET, POST }, components, config, LegalDocumentRenderer(), LegalLanguageNotice()

### Community 28 - "Community 28"
Cohesion: 0.11
Nodes (15): AdminReservationsPage(), ALL_SLOTS, ApiResponse, DayInfo, DAYS_FULL, DAYS_SHORT, formatFullDate(), MONTHS_ABBR (+7 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (20): generate(), Bd(), cr(), cu(), em(), Eu(), Hd(), jd() (+12 more)

### Community 30 - "Community 30"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (19): ap(), cp(), Fd(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), getOrCreate(), ip() (+11 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (19): ap(), El(), emit(), fm(), Fr(), handleAndLogRequestError(), handleRequestError(), Iu() (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (18): $c(), Di(), el(), Fo(), getLocation(), getPlaceholderValues(), ii(), ka() (+10 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (18): as(), Bn(), cp(), ec(), indentedCurrentLine(), Jp(), li(), me() (+10 more)

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (17): Cl(), da(), Gp(), includes(), indexOf(), isEncoding(), isPreviewFeatureOn(), isRawAction() (+9 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (9): GiftCardCard(), GiftCardCardProps, GiftCardFilters(), GiftCardFiltersProps, GiftCardStatus, GiftCard, GiftCardListResponse, loadScript() (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (8): ClientLayout(), metadata, Footer(), FooterContent, Navbar(), SplashScreen(), SplashScreenProps, Toaster()

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (10): Category, Dish, DishCard(), MenuContent(), MenuData, Tab, Tabs(), TabsContent() (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (16): devDependencies, jsdom, pg, prisma, @prisma/adapter-pg, tailwindcss, @tailwindcss/postcss, tsx (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (16): aa(), cancelAllTransactions(), disconnect(), eo(), es(), getAllQueryCallbacks(), getPrintWidth(), Go() (+8 more)

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (12): formatCurrency(), formatDate(), formatDateShort(), formatReservationDate(), formatTime(), getPreviousMonday(), isToday(), isInRange() (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.23
Nodes (10): DELETE(), GET(), Params, PUT(), getAdminFromCookies(), GET(), PATCH(), GET() (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.16
Nodes (14): addItem(), ae(), append(), At(), bc(), de(), Fe(), getGlobalOmit() (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.23
Nodes (14): addMarginSymbol(), afterNextNewline(), getCurrentLineLength(), indent(), setColor(), underline(), unindent(), withIndent() (+6 more)

### Community 46 - "Community 46"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 47 - "Community 47"
Cohesion: 0.17
Nodes (13): constructor(), ds(), forSql(), Ge(), Hd(), il(), ji(), nl() (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.32
Nodes (10): GET(), buildCoverageMap(), DEFAULT_OPENING_DAYS, DEFAULT_SLOTS, EffectiveConfig, getAvailableSlots(), getEffectiveConfig(), getSlotsWithAvailability() (+2 more)

### Community 49 - "Community 49"
Cohesion: 0.18
Nodes (5): pickField(), BoutiqueContent, ChequesCadeauxContent(), GiftCardSuccessContent(), GiftCardSuccessContentProps

### Community 50 - "Community 50"
Cohesion: 0.27
Nodes (9): generateGiftCardCode(), POST(), sendConfirmationEmail(), sendGiftCardEmail(), stripe, config, handleGiftCardPayment(), handleReservationPayment() (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.17
Nodes (11): name, @types/react, peerDependencies, react, react-dom, pnpm, onlyBuiltDependencies, overrides (+3 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.27
Nodes (7): formatCurrency(), GiftCardStats(), GiftCardStatsProps, GiftCardStatusBadgeProps, statusConfig, GiftCardStats, GiftCardStatus

### Community 54 - "Community 54"
Cohesion: 0.25
Nodes (7): hashPassword(), POST(), addMinutes(), GET(), SECRET, signAdminToken(), verifyAdminToken()

### Community 55 - "Community 55"
Cohesion: 0.20
Nodes (4): createPrismaClient(), expandEnv(), globalForPrisma, PrismaClient

### Community 56 - "Community 56"
Cohesion: 0.18
Nodes (6): config, path, Prisma, {
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
}, main(), empty()

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
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 61 - "Community 61"
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

### Community 62 - "Community 62"
Cohesion: 0.20
Nodes (10): Am(), an(), Fl(), Gu(), handleAndLogRequestError(), handleRequestError(), sanitizeMessage(), vm() (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.24
Nodes (9): ContactContent, ContentLocalization, GalleryImage, HeroContent, HistoryContent, LegalDocumentContent, MenuContent, ReservationContent (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.22
Nodes (9): scripts, build, db:init, db:migrate, db:reset, db:start, dev, test (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.22
Nodes (8): browser, dependencies, @prisma/client-runtime-utils, main, name, sideEffects, types, version

### Community 66 - "Community 66"
Cohesion: 0.25
Nodes (9): destroy(), digest(), digestInto(), finish(), keccak(), update(), writeInto(), xof() (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.28
Nodes (9): Id(), kd(), kr(), Nd(), Od(), Sa(), Ta(), Xe() (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.22
Nodes (8): child, command, envFileByMode, isPotentialWrite, joinedCommand, MODE_ALIASES, modeArg, writeOps

### Community 69 - "Community 69"
Cohesion: 0.22
Nodes (8): ApiPaginationResponse, ApiResponse, GiftCard, GiftCardActionRequest, GiftCardCreateRequest, Reservation, StripeWebhookEvent, StripeWebhookSession

### Community 70 - "Community 70"
Cohesion: 0.46
Nodes (5): GET(), POST(), sendCancellationEmail(), sendContactConfirmation(), sendContactNotification()

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (8): ./runtime/client, default, require, default, import, node, require, types

### Community 72 - "Community 72"
Cohesion: 0.25
Nodes (8): imports, #main-entry-point, #wasm-compiler-loader, default, default, edge-light, worker, workerd

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (7): AdapterInfo, DriverAdapterFactory, Queryable, SqlDriverAdapter, SqlDriverAdapterFactory, SqlQueryable, Transaction

### Community 75 - "Community 75"
Cohesion: 0.29
Nodes (6): Args, Exact, GetRuntimeOutput, Narrowable, Operation, RuntimeName

### Community 76 - "Community 76"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 77 - "Community 77"
Cohesion: 0.40
Nodes (4): generateAdminGiftCardCode(), GET(), PATCH(), POST()

### Community 78 - "Community 78"
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

### Community 79 - "Community 79"
Cohesion: 0.33
Nodes (6): Prisma__AdminClient, Prisma__DayOverrideClient, Prisma__GiftCardClient, Prisma__ReservationClient, Prisma__RestaurantSettingsClient, PrismaPromise

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (6): Ad(), Cd(), Ea(), Rd(), vr(), Ye()

### Community 81 - "Community 81"
Cohesion: 0.70
Nodes (3): sendReminderEmail(), sendSmsReminder(), GET()

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): peerDependenciesMeta, react, react-dom, optional, optional

### Community 83 - "Community 83"
Cohesion: 0.50
Nodes (3): MODE_ALIASES, resolveAppMode(), resolveEnvFile()

### Community 84 - "Community 84"
Cohesion: 0.40
Nodes (5): default, import, require, types, ./edge

### Community 85 - "Community 85"
Cohesion: 0.40
Nodes (5): ./extension, default, import, require, types

### Community 86 - "Community 86"
Cohesion: 0.40
Nodes (5): ./index, default, import, require, types

### Community 87 - "Community 87"
Cohesion: 0.40
Nodes (5): ./index-browser, default, import, require, types

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (5): ./runtime/index-browser, default, import, require, types

### Community 89 - "Community 89"
Cohesion: 0.40
Nodes (5): ./runtime/wasm-compiler-edge, default, import, require, types

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (3): content, emptyFallback, withDefaults

## Knowledge Gaps
- **1040 isolated node(s):** `nextConfig`, `name`, `private`, `version`, `type` (+1035 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$()` connect `Community 2` to `Community 0`, `Community 5`, `Community 8`, `Community 16`, `Community 17`, `Community 18`, `Community 22`, `Community 29`, `Community 31`, `Community 33`, `Community 40`, `Community 44`, `Community 45`, `Community 47`, `Community 56`, `Community 62`, `Community 66`, `Community 67`, `Community 80`?**
  _High betweenness centrality (0.348) - this node is a cross-community bridge._
- **Why does `$()` connect `Community 12` to `Community 8`, `Community 17`, `Community 19`, `Community 15`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `_()` connect `Community 3` to `Community 32`, `Community 2`, `Community 34`, `Community 35`, `Community 7`, `Community 9`, `Community 11`, `Community 12`, `Community 78`, `Community 15`, `Community 16`, `Community 17`, `Community 20`, `Community 22`, `Community 24`, `Community 25`, `Community 29`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `private` to the rest of the system?**
  _1040 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.004454342984409799 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.006369426751592357 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.020937188434695914 - nodes in this community are weakly interconnected._