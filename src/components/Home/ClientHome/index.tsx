import React from "react";
import MyPets from "./MyPets";
import MyBookings from "./MyBookings";

export default function ClientHome() {
  return (
    <div className="flex flex-col gap-20">
      <MyBookings />
      <MyPets />
    </div>
  );
}
