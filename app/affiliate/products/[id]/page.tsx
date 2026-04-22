"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, PageTitle, Switch } from "@/components/shared";
import { ProductInfoCard } from "@/components/products/ProductInfoCard";
import { CommissionSection } from "@/components/products/CommissionSection";
import { ProductActions } from "@/components/products/ProductActions";
import type {
  CountryCommission,
  ProductInfo,
  Promotion,
} from "@/components/type";

const promotions: Promotion[] = [
  {
    id: "promo-1",
    name: "Promotion Name",
    description:
      "Fill overflow thumbnail frame variant export bold figma. Font horizontal polygon reesizing link italic horizontal arrange slice. Star vertical mask star style overflow inspect select plugin ellipse. Shadow asset comment content rectangle shadow shadow group. Layer distribute rotate project stroke. Mask overflow fill component object asset select flows scrolling.",
  },
  {
    id: "promo-2",
    name: "Spring Sale — 20% Off",
    description:
      "Site-wide spring promotion offering 20% off all accessories. Runs March 15 through April 30. Affiliates earn standard commission plus a 2% bonus tier on converted orders.",
  },
  {
    id: "promo-3",
    name: "Back-to-School Bundle",
    description:
      "Bundle pricing on the student starter pack. Automatically applied at checkout when any two eligible items are in the cart.",
  },
  {
    id: "promo-4",
    name: "Back-to-School Bundle",
    description:
      "Bundle pricing on the student starter pack. Automatically applied at checkout when any two eligible items are in the cart.",
  },
  {
    id: "promo-5",
    name: "Back-to-School Bundle",
    description:
      "Bundle pricing on the student starter pack. Automatically applied at checkout when any two eligible items are in the cart.",
  },
  {
    id: "promo-6",
    name: "Back-to-School Bundle",
    description:
      "Bundle pricing on the student starter pack. Automatically applied at checkout when any two eligible items are in the cart.",
  },
  {
    id: "promo-7",
    name: "Back-to-School Bundle",
    description:
      "Bundle pricing on the student starter pack. Automatically applied at checkout when any two eligible items are in the cart.",
  },
];

const commissions: CountryCommission[] = [
  {
    country: "Singapore",
    tiers: [
      { label: "Distributor", percent: "10%" },
      { label: "Originator", percent: "5%" },
      { label: "Indirect", percent: "10%" },
      { label: "Direct", percent: "15%" },
    ],
  },
  {
    country: "Thailand",
    tiers: [
      { label: "Distributor", percent: "10%" },
      { label: "Originator", percent: "5%" },
      { label: "Indirect", percent: "10%" },
      { label: "Direct", percent: "15%" },
    ],
  },
];

const product: ProductInfo = {
  name: "Product Name",
  id: "#PR6145",
  sku: "SKU-HEADPHONE-003",
  price: "$200",
  brand: "Brand Name",
  description:
    "Fill overflow thumbnail frame variant export bold figma. Font horizontal polygon reesizing link italic horizontal arrange slice. Star vertical mask star style overflow inspect select plugin ellipse. Shadow asset comment content rectangle shadow shadow group. Layer distribute rotate project stroke. Mask overflow fill component object asset select flows scrolling.",
  media: [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1776356682366-18724aa15bec?q=80&w=690&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Smart speaker on a wooden desk with its box beside it",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=750&h=700&q=80",
      alt: "Black over-ear headphones on a minimal surface",
    },
    {
      type: "video",
      url: "https://stream.media.imgix.video/5A2sgD7VEZ02yaP2drZepFPhxwneHLdkh/high.mp4",
      poster:
        "https://images.unsplash.com/photo-1761839258239-2be2146f1605?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  downloadUrl: "#",
};

export default function ProductDetailPage() {
  const params = useParams() as { id?: string } | null;
  const id = decodeURIComponent(params?.id ?? "");

  const [publishMap, setPublishMap] = useState<boolean>(true);
  return (
    <main className="flex flex-col gap-3 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Product" },
          { label: "Products", href: "/affiliate/products" },
          { label: id },
        ]}
      />
      <PageTitle
        title={id}
        actions={
          <>
            <ProductActions
              shareUrl={`https://shop.example.com/p/${encodeURIComponent(id)}`}
              downloadFilename={`${product.sku}.png`}
              qrFilename={`${product.sku}-qr.png`}
              qrSubtitle={product.name}
              disabledDownload
            />
          </>
        }
      />
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <ProductInfoCard product={product} />
        <CommissionSection
          commissions={commissions}
          promotions={promotions}
          canAdd={false}
          canRemove={false}
        />
      </div>
    </main>
  );
}
