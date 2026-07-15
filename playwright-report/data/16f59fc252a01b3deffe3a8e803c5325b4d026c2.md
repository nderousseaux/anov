# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reservation.spec.ts >> Edge Cases - Réservation >> Date du lendemain avec tous les créneaux disponibles
- Location: tests/reservation.spec.ts:920:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  835  |     await page.locator('button[type="submit"]').click();
  836  |     await page.waitForURL(/\/admin\/reservation/, { timeout: 60000 });
  837  |     await expect(page.locator('h1:text("Réservations")')).toBeVisible({
  838  |       timeout: 30000,
  839  |     });
  840  |   };
  841  | 
  842  |   test("Page admin s'affiche correctement", async ({ page }) => {
  843  |     await loginToAdmin(page);
  844  | 
  845  |     // Vérifier le titre
  846  |     await expect(page.locator('h1:text("Réservations")')).toBeVisible();
  847  | 
  848  |     // Vérifier le calendrier (35 boutons de jours - 5 semaines x 7 jours)
  849  |     await expect(page.locator('button[type="button"]')).toHaveCount(35, {
  850  |       timeout: 10000,
  851  |     });
  852  |   });
  853  | 
  854  |   test("Tabs Liste et Schéma s'affichent", async ({ page }) => {
  855  |     await loginToAdmin(page);
  856  | 
  857  |     // Le Tabs est visible uniquement quand une date est sélectionnée
  858  |     // Sélectionner une date (premier bouton du calendrier)
  859  |     await page.locator('button[type="button"]').first().click();
  860  |     await page.waitForTimeout(1000);
  861  | 
  862  |     // Vérifier que les onglets existent - attendre que le contenu soit chargé
  863  |     await page.waitForTimeout(2000);
  864  | 
  865  |     // Le bouton Liste est dans le TabsList
  866  |     await expect(page.locator('button:has-text("Liste")')).toBeVisible();
  867  |     await expect(page.locator('button:has-text("Schéma")')).toBeVisible();
  868  |   });
  869  | 
  870  |   test("Boutons de navigation du calendrier s'affichent", async ({ page }) => {
  871  |     await loginToAdmin(page);
  872  | 
  873  |     // Vérifier le bouton Aujourd'hui
  874  |     await expect(page.locator('button:has-text("Aujourd\'hui")')).toBeVisible();
  875  | 
  876  |     // Vérifier le bouton Actualiser
  877  |     await expect(page.locator('button:has-text("Actualiser")')).toBeVisible();
  878  |   });
  879  | });
  880  | 
  881  | /**
  882  |  * ======================================================
  883  |  * Edge Cases
  884  |  * ======================================================
  885  |  */
  886  | 
  887  | test.describe("Edge Cases - Réservation", () => {
  888  |   test("Same-day booking (aujourd’hui)", async ({ request }) => {
  889  |     const today = new Date();
  890  |     const todayStr = today.toISOString().split("T")[0];
  891  | 
  892  |     // Obtenir l'heure actuelle pour determiner un créneau futur
  893  |     const currentHour = today.getHours();
  894  |     const currentMin = today.getMinutes();
  895  |     let futureHour = currentHour + 2;
  896  |     if (futureHour > 20) {
  897  |       futureHour = 20;
  898  |     }
  899  |     const time = `${String(futureHour).padStart(2, "0")}:00`;
  900  | 
  901  |     const response = await request.post("/api/reservations", {
  902  |       data: {
  903  |         name: "Same Day Test",
  904  |         email: "same.day.test@example.com",
  905  |         date: todayStr,
  906  |         time,
  907  |         guests: "2",
  908  |       },
  909  |     });
  910  | 
  911  |     // Same-day booking est possible si créneau disponible
  912  |     if (response.status() === 409) {
  913  |       // Resto complet pour today - acceptable
  914  |       expect(true).toBe(true);
  915  |     } else {
  916  |       expect(response.ok()).toBeTruthy();
  917  |     }
  918  |   });
  919  | 
  920  |   test("Date du lendemain avec tous les créneaux disponibles", async ({
  921  |     request,
  922  |   }) => {
  923  |     const tomorrow = new Date();
  924  |     tomorrow.setDate(tomorrow.getDate() + 11);
  925  |     const dateStr = tomorrow.toISOString().split("T")[0];
  926  | 
  927  |     // Vérifier la disponibilité
  928  |     const availabilityResponse = await request.get(
  929  |       `/api/reservations/availability?date=${dateStr}&guests=2`,
  930  |     );
  931  |     expect(availabilityResponse.ok()).toBeTruthy();
  932  |     const availabilityData = await availabilityResponse.json();
  933  | 
  934  |     // Vérifier qu'il y a au moins un créneau (disponible ou non)
> 935  |     expect(availabilityData.slots.length).toBeGreaterThan(0);
       |                                           ^ Error: expect(received).toBeGreaterThan(expected)
  936  |   });
  937  | 
  938  |   test("3 guests avec fallback sur table de 4", async ({ request }) => {
  939  |     const date = new Date();
  940  |     date.setDate(date.getDate() + 15);
  941  |     const dateStr = date.toISOString().split("T")[0];
  942  | 
  943  |     // Créer des réservations pour table de 2
  944  |     // Cela devrait obliger à utiliser table de 3 ou 4
  945  |     const response = await request.post("/api/reservations", {
  946  |       data: {
  947  |         name: "3 Guests Test",
  948  |         email: "three.guests.test@example.com",
  949  |         date: dateStr,
  950  |         time: "19:00",
  951  |         guests: "3",
  952  |       },
  953  |     });
  954  | 
  955  |     expect(response.ok()).toBeTruthy();
  956  |     const data = await response.json();
  957  |     expect(data).toHaveProperty("url");
  958  |   });
  959  | });
  960  | 
  961  | /**
  962  |  * ======================================================
  963  |  * Webhook Stripe
  964  |  * ======================================================
  965  |  */
  966  | 
  967  | test.describe("Webhook Stripe - checkout.session.completed", () => {
  968  |   test("Webhook avec metadata valide", async ({ request }) => {
  969  |     // Créer une réservation
  970  |     const date = new Date();
  971  |     date.setDate(date.getDate() + 14);
  972  |     const dateStr = date.toISOString().split("T")[0];
  973  | 
  974  |     const createResponse = await request.post("/api/reservations", {
  975  |       data: {
  976  |         name: "Webhook Test",
  977  |         email: "webhook.test@example.com",
  978  |         date: dateStr,
  979  |         time: "19:00",
  980  |         guests: "2",
  981  |       },
  982  |     });
  983  | 
  984  |     expect(createResponse.ok()).toBeTruthy();
  985  |     const data = await createResponse.json();
  986  | 
  987  |     // Simuler le webhook Stripe
  988  |     const webhookPayload = {
  989  |       type: "checkout.session.completed",
  990  |       data: {
  991  |         object: {
  992  |           id: data.sessionId,
  993  |           metadata: {
  994  |             name: "Webhook Test",
  995  |             email: "webhook.test@example.com",
  996  |             date: dateStr,
  997  |             guests: "2",
  998  |             reservationId: "test_reservation_id",
  999  |           },
  1000 |         },
  1001 |       },
  1002 |     };
  1003 | 
  1004 |     // Note: Ce test nécessite l'endpoint webhook Stripe
  1005 |     // Pour le moment, on vérifie que l'endpoint existe
  1006 |     const webhookResponse = await request.post("/api/stripe/webhook", {
  1007 |       data: webhookPayload,
  1008 |     });
  1009 | 
  1010 |     // Le webhook peut échouer si la signature n'est pas valide
  1011 |     // C'est acceptable pour ce test
  1012 |     // Le webhook doit au moins exister (status 200 ou 400 si signature invalide)
  1013 |     expect([200, 400]).toContain(webhookResponse.status());
  1014 |   });
  1015 | });
  1016 | 
  1017 | /**
  1018 |  * ======================================================
  1019 |  * Cleanup helpers
  1020 |  * ======================================================
  1021 |  */
  1022 | 
  1023 | test.describe("Nettoyage", () => {
  1024 |   test.afterAll(async () => {
  1025 |     // Nettoyage final des emails
  1026 |     await clearMailcatcherEmailsAndValidate();
  1027 |   });
  1028 | });
  1029 | 
```