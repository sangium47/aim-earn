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

export const agentSummary: TableSummary = {
  name: "AquaPure Filter",
  description: "description-AER-IUUU",
  stats: [
    { label: "Unit Sold", value: "500" },
    { label: "Total Sales", value: "$2,000" },
    { label: "Total Commission", value: "$200" },
    {
      label: "Total My Commission",
      value: "$1,200",
    },
  ],
};

export const affiliateMembers: AffiliateMember[] = [
  {
    name: "Theresa Webb",
    agentId: "#AG8932",
    country: "SG",
    unitSold: 500,
    totalSales: "$15,200",
    commission: "$5,200",
    myCommission: "$5,200",
  },
  {
    name: "Jenny Wilson",
    agentId: "#AG3761",
    country: "SG",
    unitSold: 300,
    totalSales: "$4,100",
    commission: "$400",
    myCommission: "$400",
  },
  {
    name: "Ralph Edwards",
    agentId: "#AG6145",
    country: "SG",
    unitSold: 200,
    totalSales: "$1,100",
    commission: "$100",
    myCommission: "$100",
  },
  {
    name: "Marvin McKinney",
    agentId: "#AG9892",
    country: "SG",
    unitSold: 100,
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3",
  },
  {
    name: "Brooklyn Simmons",
    agentId: "#AG9735",
    country: "SG",
    unitSold: 20,
    totalSales: "$1,100",
    commission: "$100",
    myCommission: "$100",
  },
  {
    name: "Albert Flores",
    agentId: "#AG4719",
    country: "SG",
    unitSold: 20,
    totalSales: "$1,100",
    commission: "$100",
    myCommission: "$100",
  },
  {
    name: "Kristin Watson",
    agentId: "#AG6314",
    country: "SG",
    unitSold: 20,
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3,000",
  },
  {
    name: "Esther Howard",
    agentId: "#AG9359",
    country: "SG",
    unitSold: 20,
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3,000",
  },
  {
    name: "Darlene Robertson",
    agentId: "#AG2497",
    country: "SG",
    unitSold: 20,
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3,000",
  },
  {
    name: "Leslie Alexander",
    agentId: "#AG4828",
    country: "SG",
    unitSold: 20,
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3,000",
  },
];

export const memberSummary: TableSummary = {
  name: "Sarah Chen",
  description: "#AG8932 · Singapore",
  stats: [
    { label: "Total Orders", value: "120" },
    { label: "Total Sales", value: "$42,781" },
    { label: "Total Commission", value: "$4,278" },
    { label: "My Commission", value: "$2,139" },
  ],
};

export const memberProducts: MemberProduct[] = [
  {
    orderID: "OR0001",
    orderedDate: "2026-04-01",
    status: "Shipped",
    totalSales: "$15,200",
    commission: "$5,200",
    myCommission: "$5,200",
  },
  {
    orderID: "OR0001",
    orderedDate: "2026-04-01",
    status: "Shipped",
    totalSales: "$4,100",
    commission: "$400",
    myCommission: "$400",
  },
  {
    orderID: "OR0001",
    orderedDate: "2026-04-01",
    status: "Shipped",
    totalSales: "$1,100",
    commission: "$100",
    myCommission: "$100",
  },
  {
    orderID: "OR0001",
    orderedDate: "2026-04-01",
    status: "Shipped",
    totalSales: "$30",
    commission: "$3",
    myCommission: "$3",
  },
  {
    orderID: "OR0001",
    orderedDate: "2026-04-01",
    status: "Shipped",
    totalSales: "$1,100",
    commission: "$100",
    myCommission: "$100",
  },
];
