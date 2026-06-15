import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/components/History.tsx', 'utf8');

// Fields with defaults to preserve
const withDefaults = {
  visionTitle: "Une Vision, Une Passion",
  productsTitle: "L'Excellence des Produits",
  teamTitle: "Une Équipe d'Exception",
  wineTitle: "Une Cave d'Exception",
  gestureTitle: 'La Maîtrise du Geste',
  engagementTitle: 'Notre Engagement',
};

// Fields that use ?? '' (empty fallback)
const emptyFallback = [
  'visionText1', 'visionText2', 'visionText3',
  'productsText1', 'productsText2',
  'teamText1', 'teamText2', 'teamText3',
  'wineText1', 'wineText2', 'wineText3',
  'gestureText', 'engagementText1', 'engagementText2',
];

// Replace c.field ?? 'default' with p('field') || 'default'
for (const [field, def] of Object.entries(withDefaults)) {
  // Handle double quote fallback
  content = content.replaceAll(
    `{c.${field} ?? "${def}"}`,
    `{p('${field}') || "${def}"}`
  );
  // Handle single quote fallback
  content = content.replaceAll(
    `{c.${field} ?? '${def}'}`,
    `{p('${field}') || '${def}'}`
  );
}

// Replace c.field ?? '' with p('field')
for (const field of emptyFallback) {
  content = content.replaceAll(`{c.${field} ?? ''}`, `{p('${field}')}`);
}

writeFileSync('src/components/History.tsx', content, 'utf8');
console.log('History.tsx updated successfully');
