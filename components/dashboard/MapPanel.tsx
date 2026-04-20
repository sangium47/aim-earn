import type { SVGProps } from "react";
import { Card, CardHeader } from "./shared";

/** Stylised world-map SVG silhouette — simplified placeholder of the designer's
 *  vector mask. Swap for `react-simple-maps` in production. */
function WorldMapSilhouette(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 720 320"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <g fill="#e6e9ef">
        {/* North & Central America */}
        <path d="M40 60 Q55 40 95 42 L130 50 L150 80 L170 78 L190 100 L175 130 L140 140 L110 120 L80 130 L60 110 Z" />
        <path d="M150 160 L175 158 L200 175 L195 200 L175 210 L160 195 Z" />
        {/* South America */}
        <path d="M195 205 L225 215 L240 250 L225 290 L205 305 L190 290 L185 260 Z" />
        {/* Europe */}
        <path d="M320 70 L370 65 L395 80 L390 105 L360 115 L335 105 Z" />
        {/* Africa */}
        <path d="M340 120 L395 125 L410 160 L405 210 L380 240 L355 230 L340 190 L332 155 Z" />
        {/* Asia */}
        <path d="M410 65 L510 55 L585 75 L605 100 L585 140 L540 155 L495 145 L450 135 L420 115 Z" />
        {/* SE Asia */}
        <path d="M540 155 L570 160 L585 185 L565 200 L545 195 Z" />
        {/* Oceania */}
        <path d="M580 225 L625 220 L655 240 L640 265 L600 260 Z" />
      </g>
    </svg>
  );
}

type MapPin = { top: string; left: string; name: string; count: string };

const MAP_PINS: MapPin[] = [
  { top: "18%", left: "58%", name: "Singapore", count: "22 members" },
  { top: "28%", left: "78%", name: "Bangkok", count: "51 members" },
  { top: "56%", left: "33%", name: "Cape Town", count: "7 members" },
];

export function MapPanel() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title="Number of Affiliate Members" />

      <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#f6f7f9]">
        <WorldMapSilhouette className="h-full w-full" />

        {MAP_PINS.map((pin) => (
          <div
            key={pin.name}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ top: pin.top, left: pin.left }}
          >
            <div className="mb-1 rounded-lg bg-white px-3 py-1.5 text-xs shadow-md ring-1 ring-[#e7e7e7]">
              <p className="font-semibold text-[#1e1e1e]">{pin.name}</p>
              <p className="text-[#757575]">{pin.count}</p>
            </div>
            <div className="mx-auto size-3 rounded-full border-2 border-white bg-[#f8d237] shadow" />
          </div>
        ))}
      </div>
    </Card>
  );
}
