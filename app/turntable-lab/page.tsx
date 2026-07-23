import type { Metadata } from "next";
import { TurntableLab } from "@/components/TurntableLab";

export const metadata: Metadata = {
  title: "Turntable Interaction Lab — Marco Su",
  description: "A small interactive prototype for the record player in Marco Su's virtual room.",
};

export default function TurntableLabPage() {
  return <TurntableLab />;
}
