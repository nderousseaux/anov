import React from 'react';
import { Hero } from '../components/Hero';
import { History } from '../components/History';
import { Gallery } from '../components/Gallery';
import { Contact } from '../components/Contact';

export function HomePage() {
  return (
    <div>
      <Hero />
      <History />
      <Gallery />
      <Contact />
    </div>
  );
}
