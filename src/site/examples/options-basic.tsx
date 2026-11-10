import { Badge, CodeBlock, Cons, Option, Options, Pros, Stat } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("options-basic");
  return (
    <Options>
      <Option name="localStorage" chosen>
        <p>{text.saveInThe}</p>
        <Pros>{text.noServerWork}</Pros>
        <Cons>{text.savedPerDevice}</Cons>
        <Stat size="sm" label={text.estimatedWork} value={text.n2Days} />
        <CodeBlock lang="tsx" code={'localStorage.setItem("layout", JSON.stringify(items));'} />
      </Option>
      <Option name={text.server}>
        <p>{text.saveThroughA}</p>
        <Pros>{text.followsTheUser}</Pros>
        <Cons>
          {text.needsAnApi}
          <Badge tone="warning">{text.needsASecurity}</Badge>
        </Cons>
        <Stat size="sm" label={text.estimatedWork} value={text.n2Weeks} />
      </Option>
    </Options>
  );
}
