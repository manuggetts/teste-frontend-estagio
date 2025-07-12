"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import zxcvbn from "zxcvbn";
import * as Tooltip from "@radix-ui/react-tooltip";

import { Input, SubmitButton, Loader } from "@/components";
import { registerUser } from "@/lib/auth";
import { ToastProvider, useToast } from "@/components/ToastExample";
import { useTheme } from "@/hooks/useTheme";

const InputWithTooltip = ({
  id,
  label,
  tooltip,
  inputProps,
  error,
  shake,
}: {
  id: string;
  label: string;
  tooltip: string;
  inputProps: React.ComponentProps<typeof Input>;
  error?: boolean;
  shake?: boolean;
}) => (
  <div className="mt-6 relative">
    <label
      htmlFor={id}
      className={`block text-base font-medium mb-2 cursor-default ${
        error ? "text-red-600" : "text-gray-900 dark:text-gray-100"
      }`}
    >
      {label}
    </label>
    <Tooltip.Root delayDuration={200}>
      <Tooltip.Trigger asChild>
        <div>
          <Input
            id={id}
            {...inputProps}
            state={error ? "error" : "default"}
            className={shake ? "animate-shake" : ""}
          />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={6}
          className="bg-purple-900 text-white px-3 py-1.5 rounded-md text-sm shadow-lg select-none z-[9999]"
        >
          {tooltip}
          <Tooltip.Arrow className="fill-purple-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
);

const SignupForm = () => {
  const { push } = useRouter();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [shake, setShake] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [error, setError] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShake({ username: false, email: false, password: false, confirmPassword: false });
    }, 600);
    return () => clearTimeout(timer);
  }, [shake]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const passwordValid = (password: string) => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

  useEffect(() => {
    if (formData.email) {
      setError((prev) => ({ ...prev, email: !validateEmail(formData.email) }));
    }
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newError = { ...error };
    const newShake = { ...shake };

    if (!formData.username) {
      newError.username = true;
      newShake.username = true;
      hasError = true;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newError.email = true;
      newShake.email = true;
      hasError = true;
    }

    if (!formData.password || !passwordValid(formData.password)) {
      newError.password = true;
      newShake.password = true;
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = true;
      newShake.confirmPassword = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      setShake(newShake);
      addToast({ type: "error", message: "Por favor, corrija os erros no formulário." });
      return;
    }

    setLoading(true);
    const success = await registerUser(formData.username, formData.password, formData.email);
    setLoading(false);

    if (success) {
      addToast({ type: "success", message: "Cadastro realizado com sucesso!" });
      push("/login");
    } else {
      addToast({ type: "error", message: "Usuário já existe." });
      setError((prev) => ({ ...prev, username: true }));
      setShake((prev) => ({ ...prev, username: true }));
    }
  };

  const passwordStrength = zxcvbn(formData.password);
  const score = passwordStrength.score;

  const isPasswordValid = passwordValid(formData.password);

  const feedback = formData.password.length
    ? !isPasswordValid
      ? "Senha fraca: use pelo menos 6 caracteres com letras e números"
      : score < 3
      ? passwordStrength.feedback.warning || "Senha fraca"
      : "Senha forte!"
    : "";

  const colors = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-green-400", "bg-green-600"];
  const widths = ["w-1/5", "w-1/5", "w-2/5", "w-4/5", "w-full"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex flex-col w-[460px] p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors">
        
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-purple text-white rounded hover:bg-secondary-purple transition"
          >
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
        
        <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default text-gray-900 dark:text-gray-100">
          Cadastrar na{" "}
          <span className="gradient-text from-secondary-purple to-primary-purple">
            Capivara AI
          </span>
        </h1>

        <Tooltip.Provider delayDuration={200}>
          <form onSubmit={handleSubmit} className="flex flex-col mt-8 relative">
            <InputWithTooltip
              id="username"
              label="Usuário"
              tooltip="Escolha um nome de usuário único"
              error={error.username}
              shake={shake.username}
              inputProps={{
                name: "username",
                placeholder: "Digite seu usuário",
                value: formData.username,
                onChange: handleChange,
                disabled: loading,
              }}
            />

            <InputWithTooltip
              id="email"
              label="Email"
              tooltip="Insira um email válido (ex: exemplo@email.com)"
              error={error.email}
              shake={shake.email}
              inputProps={{
                name: "email",
                type: "email",
                placeholder: "Digite seu email",
                value: formData.email,
                onChange: handleChange,
                disabled: loading,
              }}
            />
            {formData.email && error.email && (
              <p className="text-sm text-red-500 mt-1">Email inválido</p>
            )}

            <InputWithTooltip
              id="password"
              label="Senha"
              tooltip="Mínimo 6 caracteres. Use números e letras."
              error={error.password}
              shake={shake.password}
              inputProps={{
                name: "password",
                type: showPassword ? "text" : "password",
                placeholder: "Digite sua senha",
                value: formData.password,
                onChange: handleChange,
                disabled: loading,
                icon: showPassword ? (
                  <EyeOff size={20} className="text-primary-purple" />
                ) : (
                  <Eye size={20} className="text-primary-purple" />
                ),
                onClickIcon: () => setShowPassword((prev) => !prev),
              }}
            />

            {formData.password.length > 0 && (
              <>
                <div className="mt-2 h-2 bg-gray-200 rounded">
                  <div
                    className={`${colors[score]} ${widths[score]} h-2 rounded transition-all duration-500`}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feedback}</p>
              </>
            )}

            <InputWithTooltip
              id="confirmPassword"
              label="Confirmar Senha"
              tooltip="Repita a senha exatamente como digitou acima"
              error={error.confirmPassword}
              shake={shake.confirmPassword}
              inputProps={{
                name: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                placeholder: "Confirme sua senha",
                value: formData.confirmPassword,
                onChange: handleChange,
                disabled: loading,
                icon: showConfirmPassword ? (
                  <EyeOff size={20} className="text-primary-purple" />
                ) : (
                  <Eye size={20} className="text-primary-purple" />
                ),
                onClickIcon: () => setShowConfirmPassword((prev) => !prev),
              }}
            />

            <SubmitButton
              title={loading ? "Cadastrando..." : "Cadastrar"}
              disabled={loading}
              className="mt-8"
            />

            {loading && (
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
                <Loader />
              </div>
            )}
          </form>
        </Tooltip.Provider>
      </div>
    </div>
  );
};

const Signup = () => (
  <ToastProvider>
    <SignupForm />
  </ToastProvider>
);

export default Signup;