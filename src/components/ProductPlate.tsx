import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  bg: string;
  className?: string;
  imgClassName?: string;
};

/** Fondo luminoso del producto que integra la fotografía con la paleta de la tienda. */
export default function ProductPlate({ src, alt, bg, className = "", imgClassName = "" }: Props) {
  return (
    <div className={`product-plate ${className}`} style={{ "--plate": bg } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={imgClassName} loading="lazy" draggable={false} />
    </div>
  );
}
