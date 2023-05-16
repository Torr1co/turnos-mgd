import React from "react";
import { api } from "~/utils/api";

export default function VetHome() {
  const { mutate } = api.clients.sendEmail.useMutation();
  return (
    <div>
      VetHome
      <button onClick={() => mutate()}>enviar </button>
    </div>
  );
}
