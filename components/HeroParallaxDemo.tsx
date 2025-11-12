"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";
import { useTranslations } from "next-intl";

const productData = [
  { key: "moonbeam", link: "https://gomoonbeam.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/moonbeam.png" },
  { key: "cursor", link: "https://cursor.so", thumbnail: "https://aceternity.com/images/products/thumbnails/new/cursor.png" },
  { key: "rogue", link: "https://userogue.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/rogue.png" },
  { key: "editorially", link: "https://editorially.org", thumbnail: "https://aceternity.com/images/products/thumbnails/new/editorially.png" },
  { key: "editrix", link: "https://editrix.ai", thumbnail: "https://aceternity.com/images/products/thumbnails/new/editrix.png" },
  { key: "pixelPerfect", link: "https://app.pixelperfect.quest", thumbnail: "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png" },
  { key: "algochurn", link: "https://algochurn.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/algochurn.png" },
  { key: "aceternity", link: "https://ui.aceternity.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/aceternityui.png" },
  { key: "tailwindKit", link: "https://tailwindmasterkit.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png" },
  { key: "smartbridge", link: "https://smartbridgetech.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/smartbridge.png" },
  { key: "renderwork", link: "https://renderwork.studio", thumbnail: "https://aceternity.com/images/products/thumbnails/new/renderwork.png" },
  { key: "creme", link: "https://cremedigital.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/cremedigital.png" },
  { key: "goldenBells", link: "https://goldenbellsacademy.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png" },
  { key: "invoker", link: "https://invoker.lol", thumbnail: "https://aceternity.com/images/products/thumbnails/new/invoker.png" },
  { key: "efreeInvoice", link: "https://efreeinvoice.com", thumbnail: "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png" },
] as const;

export function HeroParallaxDemo() {
  const t = useTranslations("HeroParallax");
  const products = productData.map((product) => ({
    ...product,
    title: t(`products.${product.key}`),
  }));

  return <HeroParallax products={products} headline={t("heading")} description={t("description")} />;
}
