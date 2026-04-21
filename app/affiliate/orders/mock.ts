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

export const SHIPPING_STATUS_CONFIG: Record<
  ShippingStatus,
  { label: string; dotColor: string }
> = {
  shipped: { label: "Shipped", dotColor: "#51C712" },
  preparing: { label: "Preparing", dotColor: "#FFC300" },
  in_transit: { label: "In Transit", dotColor: "#00A1FF" },
  refunded: { label: "Refunded", dotColor: "#FF0000" },
  completed: { label: "Completed", dotColor: "#6b7280" },
};

export const SHIPPING_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Shipped", value: "shipped" },
  { label: "Preparing", value: "preparing" },
  { label: "In Transit", value: "in_transit" },
  { label: "Refunded", value: "refunded" },
  { label: "Completed", value: "completed" },
];

export const ORDERS: Order[] = [
  {
    id: "OR-00241",
    orderedDate: "2026-03-12",
    customerName: "Theresa Webb",
    customerId: "#CU8932",
    orderItems: 3,
    shippingStatus: "completed",
    totalSales: "$15,200",
    commission: "$1,520",
    referralMemberName: "Sarah Chen",
    referralMemberId: "#AG8932",
    totalCommission: "$3,040",
  },
  {
    id: "OR-00242",
    orderedDate: "2026-03-15",
    customerName: "Jenny Wilson",
    customerId: "#CU3761",
    orderItems: 1,
    shippingStatus: "in_transit",
    totalSales: "$4,100",
    commission: "$410",
    referralMemberName: "Anan Suksan",
    referralMemberId: "#AG3761",
    totalCommission: "$820",
  },
  {
    id: "OR-00243",
    orderedDate: "2026-03-18",
    customerName: "Ralph Edwards",
    customerId: "#CU6145",
    orderItems: 2,
    shippingStatus: "preparing",
    totalSales: "$1,100",
    commission: "$110",
    referralMemberName: "Nur Aisyah",
    referralMemberId: "#AG6145",
    totalCommission: "$220",
  },
  {
    id: "OR-00244",
    orderedDate: "2026-03-20",
    customerName: "Marvin McKinney",
    customerId: "#CU9892",
    orderItems: 5,
    shippingStatus: "shipped",
    totalSales: "$30",
    commission: "$3",
    referralMemberName: "Wei Ming",
    referralMemberId: "#AG9892",
    totalCommission: "$6",
  },
  {
    id: "OR-00245",
    orderedDate: "2026-03-22",
    customerName: "Brooklyn Simmons",
    customerId: "#CU9735",
    orderItems: 1,
    shippingStatus: "refunded",
    totalSales: "$1,100",
    commission: "$0",
    referralMemberName: "Zhi Hao",
    referralMemberId: "#AG9735",
    totalCommission: "$0",
  },
  {
    id: "OR-00246",
    orderedDate: "2026-03-25",
    customerName: "Albert Flores",
    customerId: "#CU4719",
    orderItems: 2,
    shippingStatus: "completed",
    totalSales: "$820",
    commission: "$82",
    referralMemberName: "Sarah Chen",
    referralMemberId: "#AG8932",
    totalCommission: "$164",
  },
];
