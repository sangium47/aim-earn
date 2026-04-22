"use client";

import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Field,
  Input,
  PageTitle,
  SectionRow,
} from "@/components/shared";

export default function AdminSupportPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  return (
    <main className="relative flex min-h-[calc(100vh-68px)] flex-col gap-4 md:gap-6 p-3 md:p-6 lg:p-8 pb-[96px]">
      <Breadcrumb items={[{ label: "Support" }]} />

      <PageTitle title="Support" />

      <section className="flex flex-col gap-4 md:gap-6 rounded-2xl bg-white p-4 md:p-6 shadow-[0_3px_7.6px_0_rgba(12,12,13,0.03)]">
        <SectionRow title="Contact">
          <div className="flex flex-col gap-3 md:gap-4 w-full">
            <Field label="Phone Number">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Discover What's New! Exclusive Offers Just for You"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Title"
              />
            </Field>
            <Field label="Address">
              <Input
                multiline
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Content"
              />
            </Field>
          </div>
        </SectionRow>
      </section>

      <div
        id="support-footer"
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-end border-t border-line bg-white px-4 md:px-8 py-3"
      >
        <Button className="md:w-[140px]" onClick={() => {}}>
          Save
        </Button>
      </div>
    </main>
  );
}
