import Box from "~/lib/Box";
import Button from "~/lib/Button";
import Text from "~/lib/Typo/Text";
import { api } from "~/utils/api";

export default function Dogs() {
  const { data } = api.example.getSecretMessage.useQuery();
  console.log(data);
  return (
    <div>
      <Box>
        <Text>Perro 1</Text>
        <Button kind="secondary">Adoptar</Button>
      </Box>
    </div>
  );
}
