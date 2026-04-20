import { Card, CardHeader } from "./shared";

const TOP_AFFILIATES = [
  { id: "AF-001", name: "Sarah Chen", country: "SG", orders: 120 },
  { id: "AF-002", name: "Anan Suksan", country: "TH", orders: 100 },
  { id: "AF-003", name: "Nur Aisyah", country: "MY", orders: 89 },
  { id: "AF-004", name: "Wei Ming", country: "SG", orders: 80 },
  { id: "AF-005", name: "Zhi Hao", country: "SG", orders: 78 },
];

/** Stacked avatar chip (3 dummy avatars + "+7"). */
function AvatarStack() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block size-[34px] rounded-full border-2 border-white bg-gradient-to-br from-[#cbcfd5] to-[#9aa0ab]"
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-[#1e1e1e]">+7</span>
    </div>
  );
}

function CountryPill({ code }: { code: string }) {
  return (
    <span className="inline-flex h-6 w-9 items-center justify-center rounded bg-[#f5f5f5] text-xs font-medium tracking-wide text-[#1e1e1e]">
      {code}
    </span>
  );
}

export function TopAffiliateMembers() {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <CardHeader title="Top 10 Affiliate Members" />

      <div className="-mx-6 overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead>
            <tr className="text-left text-sm font-medium text-[#1e1e1e]">
              <th className="py-3 pl-6 pr-4 font-medium">ID · Name</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Total Orders</th>
              <th className="px-4 py-3 font-medium">Total Sales</th>
              <th className="px-4 py-3 font-medium">Total Commission</th>
              <th className="px-4 py-3 font-medium">Direct Commission</th>
              <th className="px-4 py-3 font-medium">Indirect Commission</th>
              <th className="px-4 py-3 pr-6 font-medium">Products</th>
            </tr>
          </thead>
          <tbody>
            {TOP_AFFILIATES.map(({ id, name, country, orders }) => (
              <tr key={id} className="align-middle">
                <td className="py-4 pl-6 pr-4">
                  <div className="flex flex-col">
                    <span className="text-base text-[#1e1e1e]">{name}</span>
                    <span className="text-sm text-[#878787]">{id}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <CountryPill code={country} />
                </td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">{orders}</td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">$42,781</td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">$42,781</td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">$42,781</td>
                <td className="px-4 py-4 text-base text-[#1e1e1e]">$42,781</td>
                <td className="px-4 py-4 pr-6">
                  <AvatarStack />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}