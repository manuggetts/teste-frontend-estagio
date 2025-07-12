"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";

import { authenticateUser, isAuthenticated, login } from "@/lib/auth";
import { Input, SubmitButton, Loader } from "@/components";
import { useTheme } from "@/hooks/useTheme"; // Hook de tema (adicionado)

const Login = () => {
  const { push } = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCredentialsInvalid, setIsCredentialsInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeUsername, setShakeUsername] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const { theme, toggleTheme } = useTheme(); // Tema escuro/claro

  useEffect(() => {
    if (isAuthenticated()) {
      push("/dashboard");
    }
  }, [push]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setIsCredentialsInvalid(false);
    setErrorMessage("");
    setShakeUsername(false);
    setShakePassword(false);

    if (!loginData.username || !loginData.password) {
      if (!loginData.username) setShakeUsername(true);
      if (!loginData.password) setShakePassword(true);
      setIsSubmitLoading(false);
      return;
    }

    try {
      const isValid = await authenticateUser(loginData.username, loginData.password);

      if (isValid) {
        login("dummy-token", rememberMe);
        push("/dashboard");
      } else {
        setIsCredentialsInvalid(true);
        setErrorMessage("Credenciais inválidas. Verifique seu usuário e senha!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Aconteceu um erro ao realizar o login. Tente novamente.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (shakeUsername || shakePassword) {
      const timer = setTimeout(() => {
        setShakeUsername(false);
        setShakePassword(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shakeUsername, shakePassword]);

  return (
    <Suspense fallback="Carregando...">
      {/* cor de fundo baseada no tema */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* tema escuro no card */}
        <div className="flex flex-col w-[450px] p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
          <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default text-gray-900 dark:text-white">
            Entrar na{" "}
            <span className="gradient-text from-secondary-purple to-primary-purple">
              Capivara AI
            </span>
          </h1>

          {/* Botão alternar entre modo claro e escuro */}
          <button
            onClick={toggleTheme}
            className="self-end mt-4 mb-2 px-3 py-1 rounded bg-primary-purple text-white hover:bg-secondary-purple transition"
          >
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col mt-4 relative">
            <label className="block text-base font-medium mt-8 mb-2 text-gray-800 dark:text-gray-200" htmlFor="username-input">
              Usuário
            </label>
            <Input
              id="username-input"
              type="text"
              placeholder="Digite seu usuário"
              value={loginData.username}
              onChange={(event) => {
                setLoginData({ ...loginData, username: event.target.value });
                if (isCredentialsInvalid) setIsCredentialsInvalid(false);
              }}
              state={isCredentialsInvalid ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakeUsername && "animate-shake"}`}
            />

            <label className="block text-base font-medium mt-8 mb-2 text-gray-800 dark:text-gray-200" htmlFor="password-input">
              Senha
            </label>
            <Input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={loginData.password}
              onChange={(event) => {
                setLoginData({ ...loginData, password: event.target.value });
                if (isCredentialsInvalid) setIsCredentialsInvalid(false);
              }}
              state={isCredentialsInvalid ? "error" : "default"}
              disabled={isSubmitLoading}
              className={`${shakePassword && "animate-shake"}`}
              icon={
                showPassword ? (
                  <EyeOff size={20} className="text-primary-purple" />
                ) : (
                  <Eye size={20} className="text-primary-purple" />
                )
              }
              onClickIcon={() => setShowPassword((prev) => !prev)}
            />

            <div className="flex items-center mt-6 select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                disabled={isSubmitLoading}
                className="mr-2 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                Lembrar de mim
              </label>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <X size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-200 text-sm">{errorMessage}</span>
              </div>
            )}

            <SubmitButton title="Entrar" className="mt-8" disabled={isSubmitLoading} />

            {isSubmitLoading && (
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
                <Loader />
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600 dark:text-gray-300">Não tem uma conta? </span>
            <button
              type="button"
              onClick={() => push("/signup")}
              className="text-primary-purple hover:text-secondary-purple font-medium transition-colors"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Login;