import type { Metadata } from "next";
import { AccessibilityStatement } from "@/components/sections/accessibility-statement";

export const metadata: Metadata = {
  title: "Accessibility",
};

export default function AccessibilityPage() {
  return <AccessibilityStatement />;
}
