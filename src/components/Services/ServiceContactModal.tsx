import React from "react";
import { type Service } from "@prisma/client";
import { ServiceItem } from "./ServicesList";
import ContactModal from "../Contact/ContactModal";
import { ServiceContactData } from "~/utils/schemas/serviceUtils";

export default function ServiceContactModal({ service }: { service: Service }) {
  return (
    <ContactModal
      subject={ServiceContactData.SUBJECT}
      reason={ServiceContactData.REASON}
      to={service.email}
    >
      <section className="flex flex-col gap-12">
        <ServiceItem service={service} />
      </section>
    </ContactModal>
  );
}
