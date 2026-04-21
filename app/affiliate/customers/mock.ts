export const COUNTRY_NAMES: Record<string, string> = {
  SG: "Singapore",
  TH: "Thailand",
  MY: "Malaysia",
  ID: "Indonesia",
  VN: "Vietnam",
  PH: "Philippines",
};

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

export const CUSTOMERS: Customer[] = [
  {
    name: "Theresa Webb",
    code: "#CU8932",
    country: "SG",
    email: "theresa.webb@example.com",
    phone: "+65 91234567",
    lastOrderDate: "2026-03-12",
    totalSales: "$15,200",
    totalCommission: "$3,040",
    myCommission: "$1,520",
    referralMemberName: "Sarah Chen",
    referralMemberId: "#AG8932",
  },
  {
    name: "Jenny Wilson",
    code: "#CU3761",
    country: "TH",
    email: "jenny.wilson@example.com",
    phone: "+66 812345678",
    lastOrderDate: "2026-03-15",
    totalSales: "$4,100",
    totalCommission: "$820",
    myCommission: "$410",
    referralMemberName: "Anan Suksan",
    referralMemberId: "#AG3761",
  },
  {
    name: "Ralph Edwards",
    code: "#CU6145",
    country: "MY",
    email: "ralph.edwards@example.com",
    phone: "+60 123456789",
    lastOrderDate: "2026-03-18",
    totalSales: "$1,100",
    totalCommission: "$220",
    myCommission: "$110",
    referralMemberName: "Nur Aisyah",
    referralMemberId: "#AG6145",
  },
  {
    name: "Marvin McKinney",
    code: "#CU9892",
    country: "SG",
    email: "marvin.mckinney@example.com",
    phone: "+65 98765432",
    lastOrderDate: "2026-03-20",
    totalSales: "$30",
    totalCommission: "$6",
    myCommission: "$3",
    referralMemberName: "Wei Ming",
    referralMemberId: "#AG9892",
  },
  {
    name: "Brooklyn Simmons",
    code: "#CU9735",
    country: "ID",
    email: "brooklyn.simmons@example.com",
    phone: "+62 81234567890",
    lastOrderDate: "2026-03-22",
    totalSales: "$1,100",
    totalCommission: "$220",
    myCommission: "$110",
    referralMemberName: "Zhi Hao",
    referralMemberId: "#AG9735",
  },
  {
    name: "Albert Flores",
    code: "#CU4719",
    country: "VN",
    email: "albert.flores@example.com",
    phone: "+84 901234567",
    lastOrderDate: "2026-03-25",
    totalSales: "$820",
    totalCommission: "$164",
    myCommission: "$82",
    referralMemberName: "Sarah Chen",
    referralMemberId: "#AG8932",
  },
];
