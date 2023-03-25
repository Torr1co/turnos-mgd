import React from "react";
import Form from "~/lib/Form";
import { useForm } from "react-hook-form";

export default function DogWalkerForm() {
  const methods = useForm({
    defaultValues: {
      test: "",
      test2: "",
    },
  });
  // console.log(methods.watch());
  return (
    <Form
      methods={methods}
      onSubmit={(data) => {
        console.log(data);
      }}
    >
      DogWalkerForm
      <Form.Input className="bg" path="test" placeholder="Enter your name" />
      <Form.Input className="test" path="test2" />
    </Form>
  );
}
