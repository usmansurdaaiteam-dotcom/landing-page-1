import type { Metadata } from "next";
import ConceptShell from "@/components/ConceptShell";
import { getProduct } from "@/lib/product";
import Concept03Client from "./ui";

export const metadata: Metadata = {
  title: "Concept 03 — From Source to Story",
};

export default function Concept03Page() {
  const product = getProduct();
  return (
    <ConceptShell slug="03" background="bg-paper">
      <Concept03Client product={product} />
    </ConceptShell>
  );
}
