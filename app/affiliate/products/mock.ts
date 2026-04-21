export type Product = {
  sku: string;
  name: string;
  brand: string;
  price: string;
  thumbnail: string;
  shareUrl: string;
};

export const PRODUCTS: Product[] = [
  {
    sku: "SKU-HEADPHONE-001",
    name: "StellarTech ANC Headphones",
    brand: "StellarTech",
    price: "$15,200",
    thumbnail: "https://placehold.co/80x80?text=HP",
    shareUrl: "https://shop.example.com/p/SKU-HEADPHONE-001?ref=XX0025",
  },
  {
    sku: "SKU-EARBUDS-014",
    name: "StellarTech Pro Earbuds",
    brand: "StellarTech",
    price: "$4,100",
    thumbnail: "https://placehold.co/80x80?text=EB",
    shareUrl: "https://shop.example.com/p/SKU-EARBUDS-014?ref=XX0025",
  },
  {
    sku: "SKU-SPEAKER-007",
    name: "AquaSound Bluetooth Speaker",
    brand: "AquaSound",
    price: "$1,100",
    thumbnail: "https://placehold.co/80x80?text=SP",
    shareUrl: "https://shop.example.com/p/SKU-SPEAKER-007?ref=XX0025",
  },
  {
    sku: "SKU-WATCH-032",
    name: "Nimbus Fitness Watch",
    brand: "Nimbus",
    price: "$3,800",
    thumbnail: "https://placehold.co/80x80?text=WT",
    shareUrl: "https://shop.example.com/p/SKU-WATCH-032?ref=XX0025",
  },
  {
    sku: "SKU-CAMERA-021",
    name: "Orbit 4K Action Camera",
    brand: "Orbit",
    price: "$9,900",
    thumbnail: "https://placehold.co/80x80?text=CM",
    shareUrl: "https://shop.example.com/p/SKU-CAMERA-021?ref=XX0025",
  },
];

export type PromotionStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "published"
  | "rejected"
  | "expired";

export type DiscountType = "percentage" | "amount";

export type Promotion = {
  id: string;
  thumbnail: string;
  thumbnailName: string;
  thumbnailSize: string; // human-readable, e.g. "1.2 MB"
  name: string; // promotion title
  description: string;
  productId: string; // e.g. SKU-HEADPHONE-001
  productName: string;
  brand: string;
  country: string; // country code, e.g. "SG"
  periodStart: string; // ISO YYYY-MM-DD
  periodEnd: string;
  discountType: DiscountType;
  discountValue: number;
  status: PromotionStatus;
};

export const DISCOUNT_TYPE_OPTIONS: { label: string; value: DiscountType }[] = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Amount ($)", value: "amount" },
];

export const STATUS_CONFIG: Record<
  PromotionStatus,
  { label: string; dotColor: string }
> = {
  draft: { label: "Draft", dotColor: "#00A1FF" },
  under_review: { label: "Under Review", dotColor: "#FFC300" },
  approved: { label: "Approved", dotColor: "#51C712" },
  published: { label: "Published", dotColor: "#E400F5" },
  rejected: { label: "Rejected", dotColor: "#FF0000" },
  expired: { label: "Expired", dotColor: "#ADADAD" },
};

export const PROMOTIONS: Promotion[] = [
  {
    id: "PR-001",
    thumbnail: "https://placehold.co/80x80?text=HP",
    thumbnailName: "spring-sale-headphones.png",
    thumbnailSize: "1.2 MB",
    name: "Spring Sale 20% Off",
    description:
      "Site-wide spring promotion offering 20% off the StellarTech ANC Headphones. Runs March 15 through April 30. Affiliates earn standard commission plus a 2% bonus tier on converted orders.",
    productId: "SKU-HEADPHONE-001",
    productName: "StellarTech ANC Headphones",
    brand: "StellarTech",
    country: "SG",
    periodStart: "2026-03-15",
    periodEnd: "2026-04-30",
    discountType: "percentage",
    discountValue: 20,
    status: "published",
  },
  {
    id: "PR-002",
    thumbnail: "https://placehold.co/80x80?text=EB",
    thumbnailName: "early-bird-earbuds.jpg",
    thumbnailSize: "842 KB",
    name: "Early Bird Deal",
    description:
      "Limited-time 15% off for the first 500 buyers of the Pro Earbuds. Auto-applies at checkout when stock lasts.",
    productId: "SKU-EARBUDS-014",
    productName: "StellarTech Pro Earbuds",
    brand: "StellarTech",
    country: "TH",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    discountType: "percentage",
    discountValue: 15,
    status: "expired",
  },
  {
    id: "PR-003",
    thumbnail: "https://placehold.co/80x80?text=SP",
    thumbnailName: "bundle-save-speaker.png",
    thumbnailSize: "2.4 MB",
    name: "Bundle & Save",
    description:
      "Buy a Bluetooth Speaker with any audio accessory and get 10% off the bundle. Stackable with member discounts up to a max of 15%.",
    productId: "SKU-SPEAKER-007",
    productName: "AquaSound Bluetooth Speaker",
    brand: "AquaSound",
    country: "MY",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    discountType: "percentage",
    discountValue: 10,
    status: "under_review",
  },
  {
    id: "PR-004",
    thumbnail: "https://placehold.co/80x80?text=WT",
    thumbnailName: "fitness-month-watch.png",
    thumbnailSize: "3.1 MB",
    name: "Fitness Month",
    description:
      "A month-long campaign highlighting the Nimbus Fitness Watch. Includes creator bundle kits and extra affiliate training resources.",
    productId: "SKU-WATCH-032",
    productName: "Nimbus Fitness Watch",
    brand: "Nimbus",
    country: "SG",
    periodStart: "2026-04-10",
    periodEnd: "2026-05-10",
    discountType: "amount",
    discountValue: 25,
    status: "approved",
  },
  {
    id: "PR-005",
    thumbnail: "https://placehold.co/80x80?text=CM",
    thumbnailName: "launch-promo-camera.jpg",
    thumbnailSize: "1.8 MB",
    name: "Launch Promo",
    description:
      "Launch discount for the new Orbit 4K Action Camera. Early adopters receive an extended warranty plus a free accessory pack.",
    productId: "SKU-CAMERA-021",
    productName: "Orbit 4K Action Camera",
    brand: "Orbit",
    country: "ID",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    discountType: "amount",
    discountValue: 50,
    status: "draft",
  },
  {
    id: "PR-006",
    thumbnail: "https://placehold.co/80x80?text=CM",
    thumbnailName: "weekend-flash-camera.gif",
    thumbnailSize: "540 KB",
    name: "Weekend Flash",
    description:
      "72-hour weekend flash sale on the 4K Action Camera. Inventory is capped; orders are first-come, first-served.",
    productId: "SKU-CAMERA-021",
    productName: "Orbit 4K Action Camera",
    brand: "Orbit",
    country: "VN",
    periodStart: "2026-03-20",
    periodEnd: "2026-03-22",
    discountType: "percentage",
    discountValue: 30,
    status: "rejected",
  },
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const COUNTRY_OPTIONS = [
  { label: "All Countries", value: "all" },
  { label: "Singapore", value: "SG" },
  { label: "Thailand", value: "TH" },
  { label: "Malaysia", value: "MY" },
  { label: "Indonesia", value: "ID" },
  { label: "Vietnam", value: "VN" },
];

export const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Under Review", value: "under_review" },
  { label: "Approved", value: "approved" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];
