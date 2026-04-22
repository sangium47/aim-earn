import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

// Button (components/ui/Button.tsx)
export type ButtonVariant = "brand" | "outline";
export type ButtonSize = "md" | "lg";

// Breadcrumb (components/shared/Breadcrumb.tsx)
export type BreadcrumbItem = { label: string; href?: string };

// Table (components/shared/Table.tsx)
export type TableColumn<T> = {
  header: string;
  key?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  borderRight?: boolean;
};

// DateRangePicker (components/shared/DateRangePicker.tsx)
export type DateRange = { start: string; end: string };

// Dropdown (components/shared/Dropdown.tsx)
export type DropdownOption = { label: string; value: string };

// FilterBar (components/shared/FilterBar.tsx)
export type FilterBarDropdown = {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
};
export type FilterBarDateRange = {
  label?: string;
  placeholder?: string;
  value?: DateRange | null;
  onChange?: (range: DateRange) => void;
};

// Input (components/shared/Input.tsx)
type InputBaseProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
};
type SingleLineInputProps = InputBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps> & {
    multiline?: false;
  };
type MultilineInputProps = InputBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof InputBaseProps> & {
    multiline: true;
  };
export type InputProps = SingleLineInputProps | MultilineInputProps;

// Tabs (components/shared/Tabs.tsx)
export type TabItem<TValue extends string = string> = {
  value: TValue;
  label: ReactNode;
};

// Confirmation screen (components/confirmation-screen/ConfirmationScreen.tsx)
export type ConfirmationScreenProps = {
  /** Main heading. Defaults to the Figma source's copy. */
  title?: string;
  /** Body copy — accepts ReactNode so callers can embed `<br />`, `<strong>`, etc. */
  description: ReactNode;
  /** Override the default check-circle icon. */
  icon?: ReactNode;
  /** Optional slot for action buttons (e.g. "Open email app", "Resend"). */
  action?: ReactNode;
  className?: string;
};

// Registration (components/registration-form/RegistrationForm.tsx)
export type RegistrationValues = {
  email: string;
};
export type RegistrationFormProps = {
  /** Called with form values when the user submits the email form. */
  onSubmit?: (values: RegistrationValues) => void | Promise<void>;
  /** Called when the user clicks "Continue with Gmail". */
  onGoogleSignIn?: () => void;
  /** Called when the user clicks "Continue with Apple ID". */
  onAppleSignIn?: () => void;
  /** Disables the primary submit button and shows pending state. */
  isSubmitting?: boolean;
  /** Inline error message shown below the email field. */
  error?: string;
  /** Optional override for the outer wrapper. */
  className?: string;
};

// OTP (components/otp-form/OtpInput.tsx & OtpForm.tsx)
export type OtpInputProps = {
  /** The current OTP value as a string. Must be <= `length`. */
  value: string;
  /** Fires on every digit change. Receives the new combined string. */
  onChange: (next: string) => void;
  /** Number of digit cells. Defaults to 6. */
  length?: number;
  /** Fires when the user has filled all cells. */
  onComplete?: (code: string) => void;
  /** Disables input and paste. */
  disabled?: boolean;
  /** Accessible label describing the field to screen readers. */
  ariaLabel?: string;
  /** Optional id used for the first input (for <label htmlFor>). */
  id?: string;
};
export type OtpFormProps = {
  /** Called with the 6-digit code when the user submits. */
  onSubmit?: (code: string) => void | Promise<void>;
  /** Called when the user clicks the back button. */
  onBack?: () => void;
  /** Number of digits in the code. Defaults to 6 (matches Figma). */
  length?: number;
  /** Disables the submit button and the input while an async op is running. */
  isSubmitting?: boolean;
  /** Auto-submit when the user fills all digits. Defaults to false. */
  autoSubmit?: boolean;
  /** Override outer className. */
  className?: string;
};

// Country / Select Country (components/select-country-form/*)
export type Country = {
  /** ISO 3166-1 alpha-2 code, uppercase. */
  code: string;
  /** Display name in English. */
  name: string;
};
export type SelectCountryFormProps = {
  /** Called with the selected ISO codes when the user clicks Continue. */
  onSubmit?: (countries: string[]) => void | Promise<void>;
  /** Override the country list. Defaults to the project's standard list. */
  countries?: readonly Country[];
  /** Initial selection. Useful for editing previously-saved preferences. */
  defaultValue?: string[];
  /** Disables inputs and the Continue button. */
  isSubmitting?: boolean;
  /** Override outer className. */
  className?: string;
  /** Maximum number of countries the user may select. Defaults to 3. */
  maxSelection?: number;
};
export type CountrySelectProps = {
  /** Currently selected country codes. */
  value: string[];
  /** Fires with the new array when selection changes. */
  onChange: (next: string[]) => void;
  /** Override the country list. Defaults to the project's standard list. */
  countries?: readonly Country[];
  /** Placeholder shown when no country is selected. */
  placeholder?: string;
  /** Accessible label linking the listbox to its visible <label>. */
  labelId?: string;
  /** Field id used by <label htmlFor>. */
  id?: string;
  disabled?: boolean;
  /** Maximum number of countries that can be selected. Defaults to 4. */
  maxSelection?: number;
  /** Which side of the trigger the popup opens on. Defaults to "bottom". */
  position?: "top" | "bottom";
};

// Products (components/products/*)
export type CommissionTier = {
  label: string;
  percent: string; // "10%", "5%", etc.
};
export type CountryCommission = {
  country: string;
  tiers: CommissionTier[];
};
export type ProductMedia =
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; poster?: string };
export type ProductInfo = {
  name: string;
  id: string; // e.g. "#PR6145"
  sku: string;
  price: string; // e.g. "$200"
  brand: string;
  description: string;
  /** Preferred: gallery of images and/or videos. */
  media?: ProductMedia[];
  /** Legacy single-image fallback. Used when `media` is omitted. */
  imageUrl?: string;
  imageAlt?: string;
  downloadUrl?: string;
};
export type Promotion = {
  id: string;
  name: string;
  description: string;
  /** Optional custom icon for the yellow tile. Defaults to a megaphone. */
  icon?: ReactNode;
};

// Dashboard (components/dashboard/*)
export type AffiliateMember = {
  name: string;
  agentId: string;
  country: string;
  unitSold: number;
  totalSales: string;
  commission: string;
  myCommission: string;
};
export type MemberProduct = {
  orderID: string;
  orderedDate: string;
  status: string;
  totalSales: string;
  commission: string;
  myCommission: string;
};
export type TableSummary = {
  name: string;
  description: string;
  stats: { label: string; value: string }[];
};
export type CountryDatum = {
  /** ISO 3166-1 numeric code (as string, matches world-atlas topojson ids) */
  id: string;
  /** ISO 3166-1 alpha-3 — only used internally, kept here for readability */
  iso3: string;
  name: string;
  members: number;
  /** Fill color on the map */
  fill: string;
  /** Lng/lat of the popup anchor (centroid-ish, tuned to match Figma) */
  coordinates: [number, number];
  /** Where the popup card sits relative to the anchor, in pixels */
  labelOffset: { dx: number; dy: number };
};
export type BottomPanelProps = {
  title: string;
  color?: string;
  summaryText: string;
  summaryNumber: string;
  extraColumn: { header: string; rows: string[] };
  rows: { name: string; email: string }[];
};
export type OrderStatusDatum = {
  /** Legend label, e.g. "Paid" */
  name: string;
  /** Numeric value used to size the segment in the donut */
  value: number;
  /** Hex fill for both the segment and the legend dot */
  color: string;
  /** Pre-formatted "20,000 (25%)" string shown under the legend label */
  displayLabel: string;
};
export type OrderStatusChartProps = {
  /** Centered title, e.g. "Total Orders" */
  centerTitle?: string;
  /** Centered value, e.g. "100,874" */
  centerValue: string;
  /** Segments, in clockwise order starting from 12 o'clock */
  data: OrderStatusDatum[];
  /** Optional className passed to the outer wrapper */
  className?: string;
};

// Affiliate list (components/affiliate-list/SendEmail.tsx)
export type EmailTemplate = {
  id: string;
  name: string;
};

// Payouts (app/admin/payout)
export type PayoutStatus = "paid" | "processing";
export type Payout = {
  id: string;
  circle: string; // e.g. "1 - 31 Jan 2026"
  payoutDate: string; // ISO YYYY-MM-DD
  orders: number;
  affiliates: number;
  transactionFee: string;
  totalAmount: string;
  status: PayoutStatus;
};
export type PayoutAffiliate = {
  name: string;
  code: string;
  country: string;
  totalOrders: number;
  totalSales: string;
  totalCommission: string;
  ownCommission: string;
  overridingCommission: string;
  netPayout: string;
  bankAccount: string;
  bankName: string;
};
export type PayoutGroup = {
  country: string;
  affiliates: PayoutAffiliate[];
};
export type PayoutOrderRow = {
  id: string;
  orderedDate: string; // ISO YYYY-MM-DD
  referralMemberName: string;
  referralMemberCode: string;
  customerName: string;
  customerCode: string;
  brandName: string;
  brandCode: string;
  totalSales: string;
  totalCommission: string;
  ownCommission: string;
  overridingCommission: string;
  overridingNegative?: boolean;
  shippingStatus: ShippingStatus;
};
export type PayoutAffiliateSummary = {
  code: string;
  name: string;
  country: string;
  totalOrders: number;
  totalSales: string;
  totalCommission: string;
  ownCommission: string;
  overridingCommission: string;
  orders: PayoutOrderRow[];
};

// Orders (app/*/orders/mock.ts)
export type ShippingStatus =
  | "shipped"
  | "preparing"
  | "in_transit"
  | "refunded"
  | "completed";
export type Order = {
  id: string;
  orderedDate: string; // ISO YYYY-MM-DD
  customerName: string;
  customerId: string;
  orderItems: number;
  shippingStatus: ShippingStatus;
  totalSales: string;
  commission: string;
  referralMemberName: string;
  referralMemberId: string;
  totalCommission: string;
};

// Customers (app/*/customers/mock.ts)
export type Customer = {
  name: string;
  code: string; // e.g. #CU8932
  country: string; // ISO-like short code, e.g. "SG"
  email: string;
  phone: string; // e.g. "+65 91234567"
  lastOrderDate: string; // ISO YYYY-MM-DD
  totalSales: string;
  totalCommission: string;
  myCommission: string;
  referralMemberName: string;
  referralMemberId: string;
};

// Products (app/*/products/mock.ts)
export type Product = {
  sku: string;
  name: string;
  brand: string;
  price: string;
  thumbnail: string;
  shareUrl: string;
  countries: string[];
  status: DistributorStatus;
  updatedBy: string;
  updatedDate: string; // ISO YYYY-MM-DD
};
export type ProductTab = "info" | "commission";
export type PromotionStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "published"
  | "rejected"
  | "expired";
export type DiscountType = "percentage" | "amount";
export type ProductPromotion = {
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

// Email templates (app/*/emails/mock.ts) — rich record used in the email admin pages.
// Distinct from the `EmailTemplate` dropdown option above.
export type EmailTemplateRecord = {
  id: string;
  name: string;
  title: string;
  content: string;
  promotionId?: string;
  updatedDate: string; // ISO YYYY-MM-DD
};

// Approval records (app/admin/approval/promotions)
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApprovalPromotion = {
  id: string;
  thumbnail: string;
  thumbnailName: string;
  thumbnailSize: string; // e.g. "1.2 MB"
  name: string; // promotion title
  description: string;
  productId: string; // SKU
  productName: string;
  countries: string[]; // ISO 3166-1 alpha-2
  periodStart: string; // ISO YYYY-MM-DD
  periodEnd: string;
  discountType: DiscountType;
  discountValue: number;
  requestedDate: string; // ISO YYYY-MM-DD
  requester: { name: string; code: string };
  status: ApprovalStatus;
  reviewer?: { name: string; code: string };
  reviewedDate?: string;
  rejectionReason?: string;
};

export type RegistrationApproval = {
  id: string;
  distributor: { name: string; code: string };
  email: string;
  companyName: string; // also "Trading Name"
  taxId: string;
  /** Country codes the user currently ships to. Absent/empty for new users. */
  currentCountries?: string[];
  countries: string[]; // ISO 3166-1 alpha-2
  /** Per-country line items used by the Summary table. */
  countryPricing: { country: string; price: number }[];
  totalAmount: string; // pre-formatted, e.g. "$2,530"
  requestedDate: string; // ISO YYYY-MM-DD
  paymentSlipUrl: string;
  paymentSlipName: string;
  paymentSlipSize: string; // e.g. "1.2 MB"
  bank: {
    name: string;
    logoUrl: string;
    swift: string;
    accountName: string;
    accountNumber: string;
  };
  status: ApprovalStatus;
  reviewer?: { name: string; code: string };
  reviewedDate?: string;
  rejectionReason?: string;
};

// Brand roster (app/admin/brands)
export type BrandTab = "info" | "products" | "integration";
export type BrandProduct = {
  sku: string;
  name: string;
  price: string;
  thumbnail: string;
  countries: string[];
  status: DistributorStatus;
};
export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  products: number;
  totalSales: number;
  totalCommission: number;
  countries: string[];
  status: DistributorStatus;
  updatedBy: string;
  updatedDate: string;
  contact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
};

// Distributor roster (app/admin/affiliate/distributor)
export type DistributorStatus = "active" | "inactive";

// Admin setting configs (app/admin/setting)
export type CountryConfig = {
  id: string;
  name: string; // e.g. "Singapore"
  currency: string; // e.g. "SGD"
  exchangeRate: string; // e.g. "$1 = $35"
  code: string; // ISO-like short code, e.g. "SG"
  distributorFee: string; // e.g. "$10,000"
  status: DistributorStatus;
};
export type BankConfig = {
  id: string;
  name: string;
  code: string; // e.g. "0005"
  country: string; // ISO short code
  currency: string; // e.g. "SGD"
  status: DistributorStatus;
};

// Announcements (app/admin/announcement)
export type AnnouncementStatus = "published" | "upcoming" | "draft";
export type Announcement = {
  id: string;
  title: string;
  targetAudience: string;
  publishDate: string; // ISO YYYY-MM-DD
  status: AnnouncementStatus;
  createdBy: string;
  createdDate: string; // ISO YYYY-MM-DD
};

// Admin user management (app/admin/user)
export type AdminRole = {
  id: string;
  name: string;
  status: DistributorStatus;
  lastUpdated: string; // ISO YYYY-MM-DD
};
export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: DistributorStatus;
};

export type ProfileTab =
  | "profile"
  | "affiliates"
  | "selling"
  | "buying"
  | "bank";
export type Distributor = {
  id: string;
  name: string;
  email?: string;
  countries: string[];
  affiliateMembers: number;
  joined: string;
  totalOrders: number;
  totalSales: string;
  commissionPool: string;
  directCommission: string;
  indirectCommission: string;
  totalEarnings: string;
  status: DistributorStatus;
  inviter?: { name: string; code: string };
  /** Upline / parent distributor for this member. */
  distributor?: { name: string; code: string };
  bank?: {
    name: string;
    logoUrl?: string;
    swift: string;
    accountName: string;
    accountNumber: string;
  };
};

// Session user
export type UserRole = "distributor" | "affiliate" | "admin";
export type User = {
  profileImageURL: string;
  email: string;
  firstName: string;
  lastName: string;
  /** ISO 3166-1 alpha-2 codes. Affiliate and admin hold a single country. */
  countries: string[] | null;
  role: UserRole;
};
