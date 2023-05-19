import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "~/lib/Form";
import Title from "~/lib/Typo/Title";
import { ClientCreationSchema, type ClientCreation } from "~/schemas/client";
import { api } from "~/utils/api";
import ClientForm from "./ClientForm";
import BookingForm from "./BookingForm";
import PetForm from "./PetForm";
import Button from "~/lib/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { useModal } from "~/context/ModalContex";
import { InquirieType } from "@prisma/client";

const steps = [
  {
    title: (
      <Title as="h4" className="text-gray-500">
        Sobre el <span className="text-primary">Cliente</span>
      </Title>
    ),
    component: ClientForm,
  },
  {
    title: (
      <Title as="h4" className="text-gray-500">
        Sobre la <span className="text-primary">Mascota</span>
      </Title>
    ),
    component: PetForm,
  },
  {
    title: (
      <Title as="h4" className="text-gray-500">
        Sobre el <span className="text-primary">Turno</span>
      </Title>
    ),
    component: BookingForm,
  },
] as const;

export default function ClientRegister() {
  const { handleModal } = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<ClientCreation>({
    resolver: zodResolver(ClientCreationSchema),
    defaultValues: {
      booking: {
        date: new Date(),
        type: InquirieType.VACCINE,
      },
      dog: {
        gender: "MALE",
      },
    },
  });

  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const utils = api.useContext();

  const { mutate: createUser } = api.clients.create.useMutation({
    onSuccess: async (newUser) => {
      await utils.clients.getAll.cancel();
      const userWithDogs = { ...newUser, dogs: [] };
      const prevData = utils.clients.getAll.getData();
      utils.clients.getAll.setData(undefined, (old = []) => [
        ...old,
        userWithDogs,
      ]);
      return { prevData };
    },
  });

  return (
    <Form
      className="flex flex-col gap-6"
      methods={methods}
      onSubmit={(data) => {
        createUser(data, {
          onSuccess: () => {
            toast.success("Cliente registrado");
            handleModal();
          },
          onError: () => toast.error("Ha sucedido un error"),
        });
      }}
    >
      {hasErrors && (
        <div className="rounded-md bg-red-100 p-4 text-red-600">
          <p>Hay errores en el formulario</p>
        </div>
      )}
      <header className="sticky top-10 flex items-center justify-between bg-white pb-4 pb-4">
        {steps[currentStep]?.title}
        <nav className="flex items-center justify-between gap-4">
          <Button
            kind={Button.KINDS.gray}
            size="sm"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button type="submit" size="sm" disabled={hasErrors}>
              Registrar Cliente
            </Button>
          ) : (
            <Button
              kind={Button.KINDS.gray}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep((prev) => prev + 1);
                return;
              }}
            >
              <ArrowRightIcon className="h-5 w-5 text-gray-600" />
            </Button>
          )}
        </nav>
      </header>
      {steps.map((step, index) => {
        const Component = step.component;
        return (
          <div
            key={index}
            className={`${
              index === currentStep ? "block" : "hidden"
            } transition-all`}
          >
            <Component />
          </div>
        );
      })}
    </Form>
  );
}
