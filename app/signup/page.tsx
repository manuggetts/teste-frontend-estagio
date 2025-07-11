"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input, SubmitButton } from "@/components";
import { registerUser } from "@/lib/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.includes("@")) {
      setError("E-mail inválido");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      const success = await registerUser(username, password, email);
      if (!success) {
        setError("Usuário já existe");
        return;
      }
      router.push("/login");
    } catch {
      setError("Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col w-[480px] p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-center font-bold text-[28px] md:text-[32px] hover:scale-[1.03] transition-all duration-500 cursor-default">
          Criar conta na{" "}
          <span className="gradient-text from-secondary-purple to-primary-purple">
            Capivara AI
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col mt-8 space-y-4 relative">
          <Input
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              showPassword ? (
                <EyeOff size={20} className="text-primary-purple" />
              ) : (
                <Eye size={20} className="text-primary-purple" />
              )
            }
            onClickIcon={() => setShowPassword((prev) => !prev)}
          />
          <Input
            placeholder="Confirmar senha"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={
              showConfirmPassword ? (
                <EyeOff size={20} className="text-primary-purple" />
              ) : (
                <Eye size={20} className="text-primary-purple" />
              )
            }
            onClickIcon={() => setShowConfirmPassword((prev) => !prev)}
          />

          {error && <p className="text-sm text-red-500 animate-shake">{error}</p>}

          <SubmitButton title={loading ? "Criando..." : "Cadastrar"} disabled={loading} />

          <div className="mt-6 text-center">
            <span className="text-gray-600">Já tem uma conta? </span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-primary-purple hover:text-secondary-purple font-medium transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;