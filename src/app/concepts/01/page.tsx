import type { Metadata } from "next";
import ConceptShell from "@/components/ConceptShell";
import { getProduct } from "@/lib/product";
import Concept01Client from "./ui";

export const metadata: Metadata = {
  title: "Concept 01 — Transformation Pipeline",
};

export default function Concept01Page() {
  const product = getProduct();
  return (
    <ConceptShell slug="01" dark background="bg-ink">
      <Concept01Client product={product} />
    </ConceptShell>
  );
}
