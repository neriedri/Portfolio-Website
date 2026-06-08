import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { MeshBackground } from "@/components/layout/mesh-background";
import { ParticleField } from "@/components/layout/particle-field";
import { AccessibilityWidget } from "@/components/layout/accessibility-widget";

/** Public-facing chrome: header, footer, and the centered content container. */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MeshBackground />
      <ParticleField />
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>
      </main>
      <Footer />
      <AccessibilityWidget />
    </>
  );
}
