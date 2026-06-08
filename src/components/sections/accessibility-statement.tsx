"use client";

import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/components/providers/language-provider";

/**
 * Accessibility statement (הצהרת נגישות) — required under the Israeli
 * Equal Rights for Persons with Disabilities (Service Accessibility)
 * Regulations, 2013. Conformance target: IS 5568 ≈ WCAG 2.0 level AA.
 * Bilingual, rendered in the active locale.
 */

const LAST_UPDATED = "2026-06-08";

export function AccessibilityStatement() {
  const { locale } = useLanguage();
  const email = siteConfig.social.email;
  return locale === "he" ? (
    <article className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        הצהרת נגישות
      </h1>
      <p className="mt-4 text-muted">
        אתר זה שואף להבטיח חוויית גלישה נגישה לכלל המשתמשים, לרבות אנשים עם
        מוגבלות, ולעמוד בהוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
        נגישות לשירות), התשע&quot;ג–2013, ובתקן הישראלי ת&quot;י 5568 המבוסס על
        הנחיות WCAG 2.0 ברמת AA.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        מה הונגש באתר
      </h2>
      <ul className="mt-3 list-disc space-y-1 ps-6 text-muted">
        <li>ניווט מלא באמצעות מקלדת עם סימון פוקוס ברור.</li>
        <li>ניגודיות צבעים העומדת בתקן AA, במצב כהה ובהיר.</li>
        <li>טקסט חלופי (alt) לתמונות ותוויות (aria-label) לפקדים.</li>
        <li>תמיכה מלאה בעברית ובכיוון מימין-לשמאל (RTL).</li>
        <li>
          כיבוד העדפת המערכת להפחתת תנועה (prefers-reduced-motion).
        </li>
        <li>
          תפריט נגישות ייעודי: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת
          אנימציות.
        </li>
        <li>מבנה סמנטי תקין (כותרות, אזורים, דילוג לתוכן).</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        מגבלות ידועות
      </h2>
      <p className="mt-3 text-muted">
        חרף מאמצינו, ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם. אנו פועלים
        לתקן זאת באופן שוטף.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        יצירת קשר בנושא נגישות
      </h2>
      <p className="mt-3 text-muted">
        נתקלתם בבעיית נגישות? נשמח לקבל פנייה ולטפל בה בהקדם. ניתן לפנות לרכז
        הנגישות בדוא&quot;ל:{" "}
        <a
          href={`mailto:${email}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {email}
        </a>
        .
      </p>

      <p className="mt-8 text-sm text-muted">
        הצהרה זו עודכנה לאחרונה בתאריך {LAST_UPDATED}.
      </p>
    </article>
  ) : (
    <article className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Accessibility Statement
      </h1>
      <p className="mt-4 text-muted">
        This site strives to provide an accessible experience for all users,
        including people with disabilities, and to comply with the Israeli Equal
        Rights for Persons with Disabilities (Service Accessibility) Regulations,
        2013, and with Israeli Standard IS 5568, which is based on the WCAG 2.0
        guidelines at level AA.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        What has been done
      </h2>
      <ul className="mt-3 list-disc space-y-1 ps-6 text-muted">
        <li>Full keyboard navigation with a clearly visible focus indicator.</li>
        <li>Color contrast meeting AA, in both dark and light themes.</li>
        <li>Alt text for images and aria-labels for controls.</li>
        <li>Full Hebrew and right-to-left (RTL) support.</li>
        <li>Respect for the system reduced-motion preference.</li>
        <li>
          A dedicated accessibility menu: larger text, high contrast, link
          highlighting, and stop-animations.
        </li>
        <li>Correct semantic structure (headings, landmarks, skip-to-content).</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Known limitations
      </h2>
      <p className="mt-3 text-muted">
        Despite our efforts, some parts of the site may not yet be fully
        accessible. We work to address these on an ongoing basis.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Accessibility contact
      </h2>
      <p className="mt-3 text-muted">
        Found an accessibility issue? We&apos;d be glad to hear from you and will
        address it promptly. Contact the accessibility coordinator by email:{" "}
        <a
          href={`mailto:${email}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {email}
        </a>
        .
      </p>

      <p className="mt-8 text-sm text-muted">
        This statement was last updated on {LAST_UPDATED}.
      </p>
    </article>
  );
}
