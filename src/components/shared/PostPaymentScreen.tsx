import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export interface PostPaymentAction {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: "default" | "outline";
}

export type PostPaymentTone = "success" | "error" | "warning";

const TONE_CLASSNAMES: Record<PostPaymentTone, string> = {
  success: "bg-green-500/10 text-green-500",
  error: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-500",
};

interface PostPaymentScreenProps {
  /** Icon displayed inside the colored circle (e.g. a lucide-react icon). */
  icon: ReactNode;
  /** Controls the circle's color. Defaults to "success". */
  tone?: PostPaymentTone;
  title: string;
  description?: ReactNode;
  /** Optional extra content (order/reservation details, help boxes, etc.), rendered inside a card. */
  children?: ReactNode;
  /**
   * Call-to-action buttons shown at the bottom of the screen, in order.
   * The last action is usually the constant "back to home" action, the
   * others are contextual to the flow that just completed.
   */
  actions: PostPaymentAction[];
}

/**
 * Shared visual layout for every post-payment screen (products, gift cards,
 * reservations and gourmet offers), so the success/error/expired states look
 * identical across flows while the copy and actions stay contextual.
 */
export function PostPaymentScreen({
  icon,
  tone = "success",
  title,
  description,
  children,
  actions,
}: PostPaymentScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-16 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              TONE_CLASSNAMES[tone],
            )}
          >
            {icon}
          </div>
          <h1
            className="text-3xl md:text-4xl mb-3 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          {description && (
            <div className="text-muted-foreground">{description}</div>
          )}
        </div>

        {children && (
          <div className="bg-card border border-primary/20 rounded-lg p-8 space-y-5 mb-6 text-left">
            {children}
          </div>
        )}

        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {actions.map((action) => (
              <Button
                key={action.href + action.label}
                asChild
                variant={action.variant ?? "default"}
                className={
                  action.variant === "outline"
                    ? "border-primary/30"
                    : "bg-primary hover:bg-primary/90"
                }
              >
                <Link
                  href={action.href}
                  className="flex items-center justify-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared loading state (waiting for the payment webhook / session lookup). */
export function PostPaymentLoading({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
