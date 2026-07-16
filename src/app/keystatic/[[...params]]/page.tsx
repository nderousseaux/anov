"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

const KeystaticPage = makePage(config);

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement

// KeystaticPage est un composant React Server Component qui prend des props spécifiques
// Keystatic ne exports pas ses types, on utilise le type générique du next app router

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default KeystaticPage as any;
