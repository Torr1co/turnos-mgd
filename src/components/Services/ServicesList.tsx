import React from "react";
import { ServiceOptions } from "~/schemas/serviceSchema";
import { getOptionLabel } from "~/utils/schemaUtils";
import { cn } from "~/utils/styleUtils";
import Box from "../_common/Box";
import { ServiceIcons } from "../_common/icons";
import Text from "../_common/Typo/Text";
import Title from "../_common/Typo/Title";
import Image from "next/image";
import { type Service } from "@prisma/client";
import { ServiceActions } from "./ServicesActions";

export const ServiceItem = ({ service }: { service: Service }) => {
  const Icon = ServiceIcons[service.type];

  return (
    <div className="flex  flex-col gap-8 bg-white">
      <div className="items group flex justify-between">
        {service.photo ? (
          <div className="relative h-[100px] w-full max-w-[100px]">
            <Image
              src={service.photo}
              alt="service photo"
              fill={true}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div>
            <Icon width="100" height="100" />
          </div>
        )}
        <div className="text-right">
          <Text className="font-semibold">Informacion de contacto:</Text>
          <Text className="max-w-xs break-words">{service.email}</Text>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Title
          as="h3"
          className="h-max transition-colors duration-200 truncate group-hover:text-primary"
        >
          {getOptionLabel(ServiceOptions, service.type)}{" "}
        </Title>
        <Text
          className={cn(
            "truncate-3",
            "text-gray-500 transition-colors duration-200 group-hover:text-primary"
          )}
        >
          <span className="font-semibold"> Nombre de contacto: </span>
          <span className="capitalize">{service.name}</span>
        </Text>
        <Text
          className={cn(
            "truncate-3",
            "text-gray-500 transition-colors duration-200 group-hover:text-primary"
          )}
        >
          <span className="font-semibold"> Zona de trabajo: </span>
          {service.zone}
        </Text>

        <Text
          className={cn(
            "truncate-2",
            "text-gray-500 transition-colors duration-200 group-hover:text-primary"
          )}
        >
          <span className="font-semibold"> Horario de trabajo: </span>
          {service.hour}
        </Text>
      </div>
    </div>
  );
};

export default function ServicesList({ services }: { services: Service[] }) {
  return services.length === 0 ? (
    <div>No se encontraron servicios</div>
  ) : (
    <ul className="grid  gap-12 md:grid-cols-2">
      {services.map((service) => {
        return (
          <li key={service.id} className="h-full">
            <Box className="flex h-full flex-col gap-8 bg-white">
              <ServiceItem service={service} />
              <ServiceActions service={service} />
            </Box>
          </li>
        );
      })}
    </ul>
  );
}
