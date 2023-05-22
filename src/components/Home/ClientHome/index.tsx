import React from "react";
import ClientPets from "./ClientPets";
import ClientBookings from "./ClientBookings";

export default function ClientHome() {
  return (
    <div className="flex flex-col gap-20">
      <ClientPets />
      <ClientBookings />
    </div>
  );
}
