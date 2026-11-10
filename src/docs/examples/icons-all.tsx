import { Icon, iconNames, useToast } from "ui";

export default function Example() {
  const toast = useToast();
  const copy = (name: string) => {
    navigator.clipboard?.writeText(name);
    toast({ message: name, status: "good", duration: 1500 });
  };
  return (
    <div className="docs-icons">
      {iconNames.map((name) => (
        <button type="button" className="docs-icon" key={name} onClick={() => copy(name)}>
          <Icon name={name} size="lg" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}
