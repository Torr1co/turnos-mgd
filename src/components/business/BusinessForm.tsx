import React from "react";
import { useFormContext } from "react-hook-form";
import Form from "~/components/_common/Form";
import { type BusinessRegisterSchema } from "~/schemas/businessSchema";
import Button from "../_common/Button";
import Title from "../_common/Typo/Title";
import GoogleMap from "../_common/GoogleMap";
import GoogleMapsProvider from "../_common/GoogleMap/GoogleMapProvider";
import {
  MAGDALENA_CENTER_LOCATION,
  getMapPositionByUrl,
} from "~/utils/googleMapsUtils";

enum Days {
  Domingo,
  Lunes,
  Martes,
  Miercoles,
  Jueves,
  Viernes,
  Sabado,
}
export default function BusinessForm() {
  const methods = useFormContext<BusinessRegisterSchema>();
  const schedule = methods.watch("schedule");
  const addressLatLng = getMapPositionByUrl(methods.watch("address") as string);
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <Form.Input path="title" label="Nombre" required />
        <Form.ImageUploader path="image" label="Imagen" />
        <Form.Input path="website" label="Sitio web (ig, facebook, etc)" />
        <Form.Input
          path="address"
          label="Direccion (Haz click en el mapa)"
          disabled
          value={`${addressLatLng?.lat ?? ""}, ${addressLatLng?.lng ?? ""}`}
        />
        <GoogleMapsProvider className="col-span-2">
          <GoogleMap
            className="h-96 w-full"
            center={MAGDALENA_CENTER_LOCATION}
            zoom={13}
            onClick={(e) => {
              const lat = e.latLng?.lat() ?? 0;
              const lng = e.latLng?.lng() ?? 0;
              const url = `https://www.google.com.ar/maps/@${lat},${lng}`;
              methods.setValue("address", url);
            }}
          />
        </GoogleMapsProvider>
        <div className="col-span-2">
          <Form.Input path="addressDesc" label="Como llegar" />
        </div>
        <div className="col-span-2">
          <Form.TextArea path="desc" label="Sobre tu negocio" required />
        </div>
        <Title
          as="h4"
          className="sticky top-10 z-30 col-span-2 w-fit bg-white py-4 text-gray-500"
        >
          Sobre los <span className="text-primary">Horarios del negocio</span>
        </Title>
        <label className="col-span-2 text-base font-medium text-gray-600">
          Dias de la semana habilitados:
        </label>
        {new Array(7).fill(undefined).map((_, i) => {
          return <Form.Toggle key={i} path={`days[${i}]`} label={Days[i]} />;
        })}
        <label className="col-span-2 text-base font-medium text-gray-600">
          Horarios posibles por dia:
        </label>
        <ul className="col-span-2 flex flex-col gap-6">
          {schedule.map((_, i) => {
            return (
              <li className="flex" key={i}>
                <Form.Input
                  path={`schedule.${i}`}
                  placeholder="08:00 - 09:00"
                />
                {i !== 0 && (
                  <div className="self-end pl-6">
                    <Button
                      kind={Button.KINDS.danger}
                      onClick={() => {
                        methods.setValue(
                          "schedule",
                          schedule.filter((_, j) => j !== i)
                        );
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <Button
          onClick={() => {
            methods.setValue("schedule", [...schedule, ""]);
          }}
        >
          Agregar Horario
        </Button>
      </div>
    </div>
  );
}
