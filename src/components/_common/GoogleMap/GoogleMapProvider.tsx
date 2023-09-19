import { Wrapper, type Status } from "@googlemaps/react-wrapper";

import React from "react";
import { type FC } from "~/utils/language/types";

const RenderMessage = (status: Status) => {
  return <h1>{status}</h1>;
};

export default function GoogleMapsProvider(props: FC) {
  return (
    <div className={props.className}>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string}
        render={RenderMessage}
      >
        {props.children}
      </Wrapper>
    </div>
  );
}
