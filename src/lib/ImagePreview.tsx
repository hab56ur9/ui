export type ImagePreviewProps = {
  src: string;
  alt: string;
  onOpen?: () => void;
};

export function ImagePreview({ src, alt, onOpen }: ImagePreviewProps) {
  const image = <img src={src} alt={alt} loading="lazy" />;
  if (!onOpen) return <span className="image-preview">{image}</span>;
  return (
    <button type="button" className="image-preview is-action" title={alt} onClick={onOpen}>
      {image}
    </button>
  );
}
