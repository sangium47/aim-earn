"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import {
  Breadcrumb,
  PageTitle,
  ShippingStatusPill,
  Table,
} from "@/components/shared";
import {
  COUNTRY_NAMES,
  CUSTOMERS,
  ORDERS,
  PRODUCTS,
} from "@/components/mock";
import { formatDateShort as formatDate } from "@/components/util";
import type { Product, TableColumn } from "@/components/type";

type LineItem = Pick<Product, "sku" | "name" | "brand" | "thumbnail"> & {
  qty: number;
  price: string;
  commission: string;
};

const ITEM_PRICES = ["$23.99", "$19.50", "$45.00", "$120.00", "$77.50"];
const ITEM_COMMISSIONS = ["$3.99", "$9.50", "$5.00", "$12.00", "$7.50"];

export default function DirectOrderDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const rawId = decodeURIComponent(params?.id ?? "");

  const order = useMemo(() => ORDERS.find((o) => o.id === rawId), [rawId]);
  const notFound = rawId !== "" && !order;

  useEffect(() => {
    if (notFound) router.replace("/admin/orders/direct");
  }, [notFound, router]);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.code === order?.customerId),
    [order?.customerId],
  );

  const items: LineItem[] = useMemo(() => {
    if (!order) return [];
    const count = Math.max(1, Math.min(order.orderItems, PRODUCTS.length, 5));
    return PRODUCTS.slice(0, count).map((p, i) => ({
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      thumbnail: p.thumbnail,
      qty: 1,
      price: ITEM_PRICES[i % ITEM_PRICES.length] ?? "$0.00",
      commission: ITEM_COMMISSIONS[i % ITEM_COMMISSIONS.length] ?? "$0.00",
    }));
  }, [order]);

  if (notFound || !order) return null;

  const columns: TableColumn<LineItem>[] = [
    {
      header: "Thumbnail",
      headerClassName: "w-[100px]",
      render: (item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt={item.name}
          className="size-12 shrink-0 rounded-lg border border-[#e7e7e7] object-cover"
        />
      ),
    },
    {
      header: "Product",
      headerClassName: "min-w-[180px]",
      key: "name",
    },
    {
      header: "SKU",
      headerClassName: "min-w-[200px]",
      key: "sku",
    },
    {
      header: "Brand",
      headerClassName: "min-w-[160px]",
      key: "brand",
    },
    {
      header: "Qty.",
      headerClassName: "w-[80px]",
      render: (item) => item.qty,
    },
    {
      header: "Price",
      headerClassName: "min-w-[120px]",
      cellClassName: "text-right",
      key: "price",
    },
    {
      header: "Commission",
      headerClassName: "min-w-[140px]",
      cellClassName: "text-right",
      key: "commission",
    },
  ];

  return (
    <main className="flex flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Order", href: "/admin/orders" }, { label: order.id }]}
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] md:text-[32px] font-medium leading-[1.1] tracking-[0.02em] text-[#222125]">
            {order.id}
          </h1>
          <ShippingStatusPill status={order.shippingStatus} />
        </div>
        <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
          Ordered Date : {formatDate(order.orderedDate)}
        </p>
      </div>

      {/* Customer Details */}
      <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)] md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
            Customer Details
          </p>
          <p className="text-[20px] md:text-[22px] font-medium leading-[1.2] tracking-[0.02em] text-[#222125]">
            {customer?.name ?? order.customerName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#222125]">
            <span className="text-[#5f5f5f]">
              {customer?.code ?? order.customerId}
            </span>
            {customer?.email ? (
              <span className="flex items-center gap-1.5">
                <Mail className="size-4 text-[#5f5f5f]" aria-hidden />
                {customer.email}
              </span>
            ) : null}
            {customer?.phone ? (
              <span className="flex items-center gap-1.5">
                <Phone className="size-4 text-[#5f5f5f]" aria-hidden />
                {customer.phone}
              </span>
            ) : null}
          </div>
          {customer?.country ? (
            <p className="text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#5f5f5f]">
              {COUNTRY_NAMES[customer.country] ?? customer.country}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/affiliate/affiliates/${encodeURIComponent(
                order.referralMemberId,
              )}`,
            )
          }
          className="group flex shrink-0 items-start justify-between gap-6 rounded-xl bg-[#222125] px-4 py-3 text-left text-white transition-opacity hover:opacity-90"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-white/80">
              Referral Member :
            </p>
            <p className="text-[15px] font-semibold leading-[1.4] tracking-[0.02em]">
              {order.referralMemberName}
            </p>
            <p className="text-[12px] font-medium leading-[1.4] tracking-[0.24px] text-white/70">
              {order.referralMemberId}
            </p>
          </div>
          <ArrowUpRight className="size-4 shrink-0" aria-hidden />
        </button>
      </section>

      {/* Items */}
      <Table
        variant="simple"
        data={items}
        columns={columns}
        minWidth="min-w-[960px]"
        pagination={false}
      />

      {/* Totals */}
      <section className="rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <dl className="ml-auto flex w-full max-w-sm flex-col gap-2 text-right text-[15px] font-medium tracking-[0.02em] text-[#222125]">
          <div className="flex items-baseline justify-end gap-6">
            <dt className="text-[#5f5f5f]">Subtotal :</dt>
            <dd className="min-w-[120px]">{order.totalSales}</dd>
          </div>
          <div className="flex items-baseline justify-end gap-6 border-t border-line pt-3">
            <dt className="text-[#5f5f5f]">Total :</dt>
            <dd className="min-w-[120px] text-[18px] font-semibold">
              {order.totalSales}
            </dd>
          </div>
          <div className="flex items-baseline justify-end gap-6 text-[14px] text-[#5f5f5f]">
            <dt>Commission :</dt>
            <dd className="min-w-[120px]">{order.totalCommission}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
