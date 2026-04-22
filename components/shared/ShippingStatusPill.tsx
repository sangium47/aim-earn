import { SHIPPING_STATUS_CONFIG } from "@/components/mock";
import type { ShippingStatus } from "@/components/type";
import { StatusPill } from "./StatusPill";

export function ShippingStatusPill({ status }: { status: ShippingStatus }) {
  return <StatusPill {...SHIPPING_STATUS_CONFIG[status]} />;
}
