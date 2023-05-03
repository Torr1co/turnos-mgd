import Form from "~/lib/Form";
import Title from "~/lib/Typo/Title";
import { useForm } from "react-hook-form";
import Box from "~/lib/Box";
import { api } from "~/utils/api";

export default function NewUser() {
  const methods = useForm();

  return (
    <div>
      <Box>
        <Title>Nueva pagina</Title>
        <Form methods={methods} onSubmit={() => undefined}>
          <Form.Input label="Email" path="email" placeholder="Email" />
          <Form.Input label="Password" path="password" placeholder="Password" />
        </Form>
      </Box>
    </div>
  );
}
