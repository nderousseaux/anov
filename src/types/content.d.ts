// Types for content fetched from Keystatic CMS
export type ContentLocalization = {
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  introTitle?: string | null;
  introText1?: string | null;
  introText2?: string | null;
  introText3?: string | null;
  visionTitle?: string | null;
  visionText1?: string | null;
  visionText2?: string | null;
  visionText3?: string | null;
  productsTitle?: string | null;
  productsText1?: string | null;
  productsText2?: string | null;
  teamTitle?: string | null;
  teamText1?: string | null;
  teamText2?: string | null;
  teamText3?: string | null;
  wineTitle?: string | null;
  wineText1?: string | null;
  wineText2?: string | null;
  wineText3?: string | null;
  gestureTitle?: string | null;
  gestureText?: string | null;
  engagementTitle?: string | null;
  engagementText1?: string | null;
  engagementText2?: string | null;
  chefName?: string | null;
  chefImage?: string | null;
  chefText1?: string | null;
  chefText2?: string | null;
  visionImage1?: string | null;
  visionImage2?: string | null;
  productsImage?: string | null;
  teamImage?: string | null;
  wineImage?: string | null;
  gestureImage?: string | null;
};

// Generic content type for Hero component
export interface HeroContent extends ContentLocalization {
  image?: string | null;
}

// Generic content type for History component
export interface HistoryContent extends ContentLocalization {
  introTitle?: string | null;
  introText1?: string | null;
  introText2?: string | null;
  chefName?: string | null;
  chefImage?: string | null;
  chefText1?: string | null;
  chefText2?: string | null;
  visionTitle?: string | null;
  visionText1?: string | null;
  visionText2?: string | null;
  visionText3?: string | null;
  visionImage1?: string | null;
  visionImage2?: string | null;
  productsTitle?: string | null;
  productsText1?: string | null;
  productsText2?: string | null;
  teamTitle?: string | null;
  teamText1?: string | null;
  teamText2?: string | null;
  teamText3?: string | null;
  teamImage?: string | null;
  wineTitle?: string | null;
  wineText1?: string | null;
  wineText2?: string | null;
  wineText3?: string | null;
  wineImage?: string | null;
  gestureTitle?: string | null;
  gestureText?: string | null;
  gestureImage?: string | null;
  engagementTitle?: string | null;
  engagementText1?: string | null;
  engagementText2?: string | null;
}

// Contact content type
export interface ContactContent {
  image?: string | null;
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hoursLine1_fr?: string | null;
  hoursLine1_en?: string | null;
  hoursLine1_de?: string | null;
  hoursLine2_fr?: string | null;
  hoursLine2_en?: string | null;
  hoursLine2_de?: string | null;
  mapsUrl?: string | null;
}

// Gallery image type
export interface GalleryImage {
  image: string | null;
  caption_fr?: string;
  caption_en?: string;
  caption_de?: string;
  caption?: string;
}

// Legal document content type
export interface LegalDocumentContent {
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  content_fr?: string | null;
  content_en?: string | null;
  content_de?: string | null;
}

// Menu content type
export interface MenuContent {
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
}

// Shop/Gift card content type
export interface ShopContent {
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  products?: Array<{
    name_fr?: string;
    name_en?: string;
    name_de?: string;
    price?: number;
    image?: string;
    description_fr?: string;
    description_en?: string;
    description_de?: string;
  }>;
}

// Reservation content type
export interface ReservationContent {
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  formTitle?: string | null;
  submitLabel?: string | null;
}
