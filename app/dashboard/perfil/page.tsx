"use client";

import { motion } from "motion/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

export default function PerfilPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-8">
          Perfil
        </h1>
      </motion.div>

      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-anima-violet/15 flex items-center justify-center">
            <span className="text-xl font-bold text-anima-violet">
              {user?.name?.charAt(0) ?? "U"}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground/80">
              {user?.name}
            </h2>
            <p className="text-sm text-foreground/40">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-foreground/[0.06] pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/50">Nome</span>
            <span className="text-sm font-medium text-foreground/70">
              {user?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/50">Email</span>
            <span className="text-sm font-medium text-foreground/70">
              {user?.email}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/50">Plano</span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-anima-violet/10 text-anima-violet">
              Premium
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button variant="ghost" onClick={logout} className="!text-red-400 hover:!bg-red-500/5">
          Sair da conta
        </Button>
      </motion.div>
    </div>
  );
}
