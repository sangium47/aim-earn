import type { SVGProps } from "react";
import { Card, CardHeader } from "../../shared";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  type ProjectionConfig,
} from "react-simple-maps";
import {
  COUNTRIES_WITH_POPUP,
  COUNTRY_FILL_BY_ID,
  MAP_COLORS,
} from "./data";
import type { CountryDatum } from "@/components/type";

// World topojson served by world-atlas. Pin the version so the id scheme
// (ISO 3166-1 numeric) doesn't drift.
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Projection tuned so Southeast Asia fills the viewport the same way as Figma.
// The card's map area is 722 × 320 in the design — we use that exact viewBox.
const MAP_WIDTH = 722;
const MAP_HEIGHT = 320;

const PROJECTION_CONFIG: ProjectionConfig = {
  // geoMercator centered over the SEA archipelago, scaled to fit
  scale: 600,
  center: [100, 10],
};

export function MapPanel() {
  return (
    <Card className="flex h-full flex-col gap-2 md:gap-4 p-3 md:p-6">
      <CardHeader title="Number of Affiliate Members" />

      <div className="relative">
        <div className="relative aspect-[722/320] w-full overflow-hidden px-2 sm:px-7">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={PROJECTION_CONFIG}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const fill =
                    COUNTRY_FILL_BY_ID.get(String(geo.id)) ??
                    MAP_COLORS.defaultLand;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={MAP_COLORS.stroke}
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", opacity: 0.9 },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {COUNTRIES_WITH_POPUP.map((c) => (
              <CountryPopup key={c.iso3} datum={c} />
            ))}
          </ComposableMap>

          {/* Bottom fade — recreates the radial "Blur Box" overlay from Figma */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 100%, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 100%)",
            }}
          />
        </div>
      </div>
    </Card>
  );
}

function CountryPopup({ datum }: { datum: CountryDatum }) {
  const { coordinates, labelOffset, name, members, fill } = datum;
  const countFormatted = new Intl.NumberFormat("en-US").format(members);

  const CARD_WIDTH = 90;
  const CARD_HEIGHT = 32;
  const CARD_RADIUS = 8;
  const PADDING_X = 20;

  return (
    <Marker coordinates={coordinates}>
      {/* leader line from the country point to the card */}
      <line
        x1={0}
        y1={0}
        x2={labelOffset.dx + (labelOffset.dx < 0 ? CARD_WIDTH : 0)}
        y2={labelOffset.dy + CARD_HEIGHT / 2}
        stroke="#1e1e1e"
        strokeWidth={0.75}
        strokeLinecap="round"
      />

      {/* card */}
      <g transform={`translate(${labelOffset.dx}, ${labelOffset.dy})`}>
        <rect
          x={0}
          y={0}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          rx={CARD_RADIUS}
          ry={CARD_RADIUS}
          fill="white"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth={1}
        />

        {/* color dot */}
        <circle cx={PADDING_X - 4} cy={10} r={4.5} fill={fill} />

        {/* country name */}
        <text
          x={PADDING_X + 6}
          y={14}
          fontSize={11}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={400}
          fill="#1e1e1e"
        >
          {name}
        </text>

        {/* member count, centered under the name */}
        <text
          x={CARD_WIDTH / 2}
          y={26}
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={500}
          fill="#1e1e1e"
          textAnchor="middle"
        >
          {countFormatted}
        </text>
      </g>
    </Marker>
  );
}
