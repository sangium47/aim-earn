export type EmailTemplate = {
  id: string;
  name: string;
  title: string;
  content: string;
  promotionId?: string;
  updatedDate: string; // ISO YYYY-MM-DD
};

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "ET-00101",
    name: "Welcome & Onboarding",
    title: "Welcome to Aim Earn 👋",
    content:
      "Hi {{name}},\n\nWelcome aboard! We're thrilled to have you. This email walks you through your first steps as a new member of the program.",
    promotionId: undefined,
    updatedDate: "2026-03-05",
  },
  {
    id: "ET-00102",
    name: "Spring Promotion",
    title: "Your spring savings are here",
    content:
      "Spring is here — and so are the deals. Enjoy 20% off StellarTech ANC Headphones this month only, with free shipping across SG.",
    promotionId: "PR-001",
    updatedDate: "2026-03-18",
  },
  {
    id: "ET-00103",
    name: "Monthly Newsletter Digest",
    title: "Your monthly roundup",
    content:
      "Here's what happened this month: new products, featured creators, and the top-earning promotions across the network.",
    promotionId: undefined,
    updatedDate: "2026-03-30",
  },
  {
    id: "ET-00104",
    name: "Abandoned Cart Reminder",
    title: "You left something behind",
    content:
      "We saved your cart for 48 hours. Tap below to finish checking out before the promo ends.",
    promotionId: "PR-006",
    updatedDate: "2026-04-02",
  },
  {
    id: "ET-00105",
    name: "Order Confirmation",
    title: "Order received — thanks!",
    content:
      "We've received your order and are preparing it for shipment. You'll get another email with tracking once it ships.",
    promotionId: undefined,
    updatedDate: "2026-04-10",
  },
  {
    id: "ET-00106",
    name: "Post-Purchase Thank You",
    title: "Thanks for shopping with us",
    content:
      "Thanks again for your order. If you have a moment, leave a quick review — your feedback helps other shoppers decide.",
    promotionId: "PR-004",
    updatedDate: "2026-04-14",
  },
];
