import type { Metadata } from "next";
import ConceptShell from "@/components/ConceptShell";
import { getProduct } from "@/lib/product";
import Concept02Client from "./ui";

export const metadata: Metadata = {
  title: "Concept 02 — Deliverables Breakdown",
};

export default function Concept02Page() {
  const product = getProduct();
  return (
    <ConceptShell slug="02" background="bg-cream">
      <Concept02Client product={product} />
    </ConceptShell>
  );
}
