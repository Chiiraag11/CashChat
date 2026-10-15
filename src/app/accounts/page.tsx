
import { BanksDetectedFromGmail } from '@/components/accounts/BanksDetectedFromGmail';
import {
  ArrowUpRight,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AccountsPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Accounts hero */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-violet-500/[0.05] to-cyan-500/[0.07] p-5 md:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            CASHCHAT INTELLIGENCE
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Accounts
                </h1>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Discover banks mentioned in your email notifications
                and statements, all from one place.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5 text-xs font-medium text-cyan-400">
              <ShieldCheck className="h-4 w-4" />
              Gmail read-only access
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Detected banks */}
      <BanksDetectedFromGmail />
    </div>
  );
}
