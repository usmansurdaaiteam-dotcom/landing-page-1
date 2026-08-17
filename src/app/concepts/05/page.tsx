import type { Metadata } from "next";
import ConceptShell from "@/components/ConceptShell";
import { getProduct } from "@/lib/product";
import Concept05Client from "./ui";

export const metadata: Metadata = {
  title: "Concept 05 — Category Explorer",
};

export default function Concept05Page() {
  const product = getProduct();
  return (
    <ConceptShell slug="05" background="bg-cream">
      <Concept05Client product={product} />
    </ConceptShell>
  );
}
