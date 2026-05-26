import { createReader } from '@keystatic/core/reader';
import { Hero } from '@/components/Hero';
import { History } from '@/components/History';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import config from '../../keystatic.config';

export default async function Page() {
  const reader = createReader(process.cwd(), config);
  const [heroContent, histoireContent, galerieContent, contactContent] = await Promise.all([
    reader.singletons.hero.read(),
    reader.singletons.histoire.read(),
    reader.singletons.galerie.read(),
    reader.singletons.contact.read(),
  ]);

  // Convertir les données readonly en types mutables
  const heroData = heroContent ? {
    subtitle: heroContent.subtitle ?? undefined,
    image: heroContent.image ?? undefined,
  } : undefined;

  const histoireData = histoireContent ? {
    introTitle: histoireContent.introTitle ?? undefined,
    introText1: histoireContent.introText1 ?? undefined,
    introText2: histoireContent.introText2 ?? undefined,
    chefImage: histoireContent.chefImage ?? undefined,
    chefName: histoireContent.chefName ?? undefined,
    chefText1: histoireContent.chefText1 ?? undefined,
    chefText2: histoireContent.chefText2 ?? undefined,
    visionTitle: histoireContent.visionTitle ?? undefined,
    visionText1: histoireContent.visionText1 ?? undefined,
    visionText2: histoireContent.visionText2 ?? undefined,
    visionText3: histoireContent.visionText3 ?? undefined,
    visionImage1: histoireContent.visionImage1 ?? undefined,
    visionImage2: histoireContent.visionImage2 ?? undefined,
    productsImage: histoireContent.productsImage ?? undefined,
    productsTitle: histoireContent.productsTitle ?? undefined,
    productsText1: histoireContent.productsText1 ?? undefined,
    productsText2: histoireContent.productsText2 ?? undefined,
    teamImage: histoireContent.teamImage ?? undefined,
    teamTitle: histoireContent.teamTitle ?? undefined,
    teamText1: histoireContent.teamText1 ?? undefined,
    teamText2: histoireContent.teamText2 ?? undefined,
    teamText3: histoireContent.teamText3 ?? undefined,
    wineTitle: histoireContent.wineTitle ?? undefined,
    wineText1: histoireContent.wineText1 ?? undefined,
    wineText2: histoireContent.wineText2 ?? undefined,
    wineText3: histoireContent.wineText3 ?? undefined,
    wineImage: histoireContent.wineImage ?? undefined,
    gestureImage: histoireContent.gestureImage ?? undefined,
    gestureTitle: histoireContent.gestureTitle ?? undefined,
    gestureText: histoireContent.gestureText ?? undefined,
    engagementTitle: histoireContent.engagementTitle ?? undefined,
    engagementText1: histoireContent.engagementText1 ?? undefined,
    engagementText2: histoireContent.engagementText2 ?? undefined,
  } : undefined;

  const galerieData = galerieContent ? {
    photos: galerieContent.photos?.map(p => ({
      image: p.image,
      caption: p.caption
    })) ?? undefined,
  } : undefined;

  const contactData = contactContent ? {
    image: contactContent.image ?? undefined,
    title: contactContent.title ?? undefined,
    subtitle: contactContent.subtitle ?? undefined,
    address: contactContent.address ?? undefined,
    phone: contactContent.phone ?? undefined,
    email: contactContent.email ?? undefined,
    hoursLine1: contactContent.hoursLine1 ?? undefined,
    hoursLine2: contactContent.hoursLine2 ?? undefined,
    mapsUrl: contactContent.mapsUrl ?? undefined,
  } : undefined;

  return (
    <div>
      <Hero subtitle={heroData?.subtitle} image={heroData?.image} />
      <History content={histoireData} />
      <Gallery images={galerieData?.photos} />
      <Contact content={contactData} />
    </div>
  );
}
