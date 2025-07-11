"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Input, SubmitButton, Loader } from "@/components";
import { registerUser } from "@/lib/auth";
import {
  ToastProvider,
  useToast,
} from "@/components/ToastExample";

const SignupForm = () => {
  const { push } = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [shakeUsername, setShakeUsername] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);
  const [shakeConfirmPassword, setShakeConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorUsername, setErrorUsername] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (
      shakeUsername ||
      shakeEmail ||
      shakePassword ||
      shakeConfirmPassword
    ) {
      const timer = setTimeout(() => {
        setShakeUsername(false);
        setShakeEmail(false);
        setShakePassword(false);
        setShakeConfirmPassword(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [shakeUsername, shakeEmail, shakePassword, shakeConfirmPassword]);

  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") setErrorUsername(false);
    if (name === "email") setErrorEmail(false);
    if (name === "password") setErrorPassword(false);
    if (name === "confirmPassword") setErrorConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.username) {
      setErrorUsername(true);
      setShakeUsername(true);
      hasError = true;
    }
    if (!formData.email || !validateEmail(formData.email)) {
      setErrorEmail(true);
      setShakeEmail(true);
      hasError = true;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorPassword(true);
      setShakePassword(true);
      hasError = true;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorConfirmPassword(true);
      setShakeConfirmPassword(true);
      hasError = true;
    }

    if (hasError) {
      addToast({ type: "error", message: "Por favor, corrija os erros no formulário." });
      return;
    }

    setLoading(true);

    const success = await registerUser(
      formData.username,
      formData.password,
      formData.email
    );

    setLoading(false);

    if (success) {
      addToast({ type: "success", message: "Cadastro realizado com sucesso!" });
      push("/login");
    } else {
      addToast({ type: "error", message: "Usuário já existe." });
      setErrorUsername(true);
      setShakeUsername(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col w-[460px] p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default">
          Cadastrar na{" "}
          <span className="gradient-text from-secondary-purple to-primary-purple">
            Capivara AI
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col mt-8 relative">
          <label htmlFor="username" className="block text-base font-medium mb-2">
            Usuário
          </label>
          <Input
            id="username"
            name="username"
            placeholder="Digite seu usuário"
            value={formData.username}
            onChange={handleChange}
            state={errorUsername ? "error" : "default"}
            disabled={loading}
            className={shakeUsername ? "animate-shake" : ""}
          />

          <label htmlFor="email" className="block text-base font-medium mt-6 mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
            state={errorEmail ? "error" : "default"}
            disabled={loading}
            className={shakeEmail ? "animate-shake" : ""}
          />

          <label htmlFor="password" className="block text-base font-medium mt-6 mb-2">
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
            state={errorPassword ? "error" : "default"}
            disabled={loading}
            className={shakePassword ? "animate-shake" : ""}
            icon={
              showPassword ? (
                <EyeOff size={20} className="text-primary-purple" />
              ) : (
                <Eye size={20} className="text-primary-purple" />
              )
            }
            onClickIcon={() => setShowPassword((prev) => !prev)}
          />

          <label
            htmlFor="confirmPassword"
            className="block text-base font-medium mt-6 mb-2"
          >
            Confirmar Senha
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            state={errorConfirmPassword ? "error" : "default"}
            disabled={loading}
            className={shakeConfirmPassword ? "animate-shake" : ""}
            icon={
              showConfirmPassword ? (
                <EyeOff size={20} className="text-primary-purple" />
              ) : (
                <Eye size={20} className="text-primary-purple" />
              )
            }
            onClickIcon={() => setShowConfirmPassword((prev) => !prev)}
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