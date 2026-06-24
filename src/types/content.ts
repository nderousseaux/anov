// Types for Keystatic content

export interface HeroContent {
  [key: string]: unknown;
  image?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface HistoryContent {
  [key: string]: unknown;
  introTitle?: string;
  introText1?: string;
  introText2?: string;
  chefImage?: string | null;
  chefName?: string;
  chefText1?: string;
  chefText2?: string;
  visionTitle?: string;
  visionText1?: string;
  visionText2?: string;
  visionText3?: string;
  visionImage1?: string | null;
  visionImage2?: string | null;
  points?: Array<{
    label?: string;
    latitude?: number | null;
    longitude?: number | null;
    image?: string | null;
    title_fr?: string;
    title_en?: string;
    title_de?: string;
    description_fr?: string;
    description_en?: string;
    description_de?: string;
    url?: string;
  }>;
  besanconLabel?: string;
  besanconImage?: string | null;
  besanconUrl?: string;
  productsTitle?: string;
  productsText1?: string;
  productsText2?: string;
  teamImage?: string | null;
  teamTitle?: string;
  teamText1?: string;
  teamText2?: string;
  teamText3?: string;
  wineTitle?: string;
  wineText1?: string;
  wineText2?: string;
  wineText3?: string;
  wineImage?: string | null;
  gestureTitle?: string;
  gestureText?: string;
  engagementTitle?: string;
  engagementText1?: string;
  engagementText2?: string;
}

export interface GalleryContent {
  [key: string]: unknown;
  title?: string;
  subtitle?: string;
  photos?: Array<{
    image?: string;
    caption_fr?: string;
    caption_en?: string;
    caption_de?: string;
  }>;
}

export interface ContactContent {
  [key: string]: unknown;
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

export interface BoutiqueContent {
  [key: string]: unknown;
  image?: string;
  title_fr?: string;
  title_en?: string;
  title_de?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  subtitle_de?: string;
  giftCardsTitle_fr?: string;
  giftCardsTitle_en?: string;
  giftCardsTitle_de?: string;
  giftCardsSubtitle_fr?: string;
  giftCardsSubtitle_en?: string;
  giftCardsSubtitle_de?: string;
  labelAmount_fr?: string;
  labelAmount_en?: string;
  labelAmount_de?: string;
  placeholderAmount_fr?: string;
  placeholderAmount_en?: string;
  placeholderAmount_de?: string;
  amounts?: string;
  labelRecipient_fr?: string;
  labelRecipient_en?: string;
  labelRecipient_de?: string;
  placeholderRecipient_fr?: string;
  placeholderRecipient_en?: string;
  placeholderRecipient_de?: string;
  labelMessage_fr?: string;
  labelMessage_en?: string;
  labelMessage_de?: string;
  placeholderMessage_fr?: string;
  placeholderMessage_en?: string;
  placeholderMessage_de?: string;
  submitButton_fr?: string;
  submitButton_en?: string;
  submitButton_de?: string;
  paymentInfo_fr?: string;
  paymentInfo_en?: string;
  paymentInfo_de?: string;
  footerSecure_fr?: string;
  footerSecure_en?: string;
  footerSecure_de?: string;
  footerValid_fr?: string;
  footerValid_en?: string;
  footerValid_de?: string;
}

export interface FooterContent {
  [key: string]: unknown;
  description_fr?: string | null;
  description_en?: string | null;
  description_de?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  reviews?: Array<{ name: string; rating: string; reviewCount: string }> | null;
  paymentMethods?: string | null;
}

export interface ReservationContent {
  [key: string]: unknown;
  image?: string | null;
  title_fr?: string | null;
  title_en?: string | null;
  title_de?: string | null;
  subtitle_fr?: string | null;
  subtitle_en?: string | null;
  subtitle_de?: string | null;
}
