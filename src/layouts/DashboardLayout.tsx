import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Mail, MailCheck, Menu, RefreshCw, X } from "lucide-react";
import ConfigBanner from "../components/ConfigBanner";
import { ThemeToggle } from "../contexts/ThemeContext";
import CuacLogo from "../components/CuacLogo";

const links = [
  { to: "/", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/correos", label: "Correos", icon: Mail, end: false },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const fetching = useIsFetching() > 0;

  const nav = (
    <nav aria-label="Principal" className="mt-8 space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-cuac-blue-600 text-white" : "text-cuac-blue-200 hover:bg-cuac-blue-800 hover:text-white"}`}>
          <Icon className="h-4 w-4" aria-hidden /> {label}
        </NavLink>
      ))}
    </nav>
  );
  const brand = (
    <div className="flex items-center gap-3 text-white">
      <CuacLogo size="md" className="text-cuac-yellow-400" />
      <div>
        <span className="text-lg font-bold">Triaje CUAC</span>
        <p className="text-xs text-cuac-blue-200">Corporación Universitaria Autónoma del Cauca</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden bg-cuac-blue-900 p-5 lg:block">{brand}{nav}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Cerrar menú" />
          <aside className="relative h-full w-64 bg-cuac-blue-900 p-5">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 text-white" aria-label="Cerrar menú"><X className="h-5 w-5" /></button>
            {brand}{nav}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur transition-colors dark:border-slate-700 dark:bg-slate-900/90 sm:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Abrir menú"><Menu className="h-5 w-5" /></button>
          <p className="font-semibold text-slate-900 dark:text-white">Bandeja de triaje</p>
          <p className="ml-auto hidden text-sm text-slate-500 dark:text-slate-400 md:block">Se actualiza cada minuto</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => qc.invalidateQueries()} disabled={fetching}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} aria-hidden /> Actualizar
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
          <ConfigBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
