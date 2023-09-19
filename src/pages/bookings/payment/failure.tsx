import React from "react";
import Button from "~/components/_common/Button";
import Title from "~/components/_common/Typo/Title";
import { useRouter } from "next/router";

export default function BookingPaymentFailure() {
  const router = useRouter();
  return (
    <div>
      <header className="my-8 flex items-center justify-between">
        <Title>Ha ocurrido un error al resrvar el turno</Title>
      </header>
      <div>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Volver atras
        </Button>
      </div>
    </div>
  );
}
