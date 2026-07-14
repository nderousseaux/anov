import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";
import GiftCardSuccessContent from "./GiftCardSuccessContent";
import { Suspense } from "react";

export default async function GiftCardSuccessPage() {
  const reader = createReader(process.cwd(), config);
  const content =
    (await reader.singletons.giftCardSuccess.read()) as Parameters<
      typeof GiftCardSuccessContent
    >[0]["content"];

  return (
    <Suspense>
      <GiftCardSuccessContent content={content} />
    </Suspense>
  );
}
