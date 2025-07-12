"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

import { isAuthenticated, logout } from "@/lib/auth";

const Dashboard = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated()) {
      push("/");
    } else {
      // Simula delay para carregar dados
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [push]);

  const handleLogout = () => {
    logout();
    push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="gradient-text from-secondary-purple to-primary-purple">
                  Capivara AI
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded bg-primary-purple text-white hover:bg-secondary-purple transition"
              >
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </button>

              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <User size={20} />
                <span>Usuário Logado</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-purple transition-colors"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-300">
            {loading ? (
              <>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-6 animate-pulse"></div>
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bem-vindo ao Dashboard!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Você está logado com sucesso. Esta é uma página de exemplo do
                  dashboard.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4"></div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;