import { Button, DescriptionList, Popover, Row, Stack } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("popover-basic");
  return (
    <Row>
      <Popover
        trigger="hover"
        title={text.member}
        content={
          <DescriptionList
            items={[
              { label: text.role, value: text.roleValue },
              { label: text.status, value: text.statusValue },
            ]}
          />
        }
      >
        <Button icon="user" label={text.member} />
      </Popover>
      <Popover
        title={text.filter}
        content={
          <Stack>
            {text.filterBody}
            <Button variant="primary">{text.apply}</Button>
          </Stack>
        }
      >
        <Button icon="filter">{text.filter}</Button>
      </Popover>
    </Row>
  );
}
