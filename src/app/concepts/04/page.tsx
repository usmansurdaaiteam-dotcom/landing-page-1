import type { Metadata } from "next";
import ConceptShell from "@/components/ConceptShell";
import { getProduct } from "@/lib/product";
import Concept04Client from "./ui";

export const metadata: Metadata = {
  title: "Concept 04 — Stage-Based Story",
};

export default function Concept04Page() {
  const product = getProduct();
  return (
    <ConceptShell slug="04" background="bg-sage-bg">
      <Concept04Client product={product} />
    </ConceptShell>
  );
}
