"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";
import { createClient } from "@/lib/supabase/client";

const copy = {
  en: {
    back: "Back to site",
    account: "Personal account",
    title: "Log in",
    description: "Log in with your email and password to view your cart and order history.",
    password: "Password",
    loading: "Logging in...",
    submit: "Log in",
    noAccount: "No account yet?",
    register: "Register",
    fallbackError: "Could not log in.",
    invalidCredentials: "Incorrect email or password.",
  },
  cs: {
    back: "Zpět na web",
    account: "Osobní účet",
    title: "Přihlášení",
    description: "Přihlaste se pomocí emailu a hesla a zobrazte svůj košík a historii objednávek.",
    password: "Heslo",
    loading: "Přihlašování...",
    submit: "Přihlásit se",
    noAccount: "Ještě nemáte účet?",
    register: "Registrovat",
    fallbackError: "Přihlášení se nezdařilo.",
    invalidCredentials: "Nesprávný email nebo heslo.",
  },
  ru: {
    back: "Вернуться на сайт",
    account: "Личный кабинет",
    title: "Вход",
    description: "Войдите по email и паролю, чтобы просматривать корзину и историю заказов.",
    password: "Пароль",
    loading: "Входим...",
    submit: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    fallbackError: "Не удалось войти.",
    invalidCredentials: "Неверный email или пароль.",
  },
} as const;

function authError(message: string, language: keyof typeof copy) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return copy[language].invalidCredentials;
  }

  return message || copy[language].fallbackError;
}

export default function LoginPage() {
  const router = useRouter();
  const { language, isLanguageReady } = useNevFimLanguage();
  const c = copy[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginError) throw loginError;

      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const safeNext =
        requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
          ? requestedNext
          : "/account";

      router.push(safeNext);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : c.fallbackError;
      setError(authError(message, language));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLanguageReady) {
    return (
      <main className="authPage">
        <div className="authPageLoader" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="authPage">
      <section className="authCard">
        <Link href="/" className="authBackLink">
          ← {c.back}
        </Link>

        <div className="authBrand">
          <img
            src="/images/logo/logo.png"
            alt="NevFim"
            className="authBrandLogo"
          />

          <div>
            <strong>
              NevFim<span>.grup</span>
            </strong>
            <small>{c.account}</small>
          </div>
        </div>

        <h1>{c.title}</h1>
        <p className="authDescription">{c.description}</p>

        <form onSubmit={handleLogin} className="authForm">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            {c.password}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="authError">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? c.loading : c.submit}
          </button>
        </form>

        <div className="authBottom">
          {c.noAccount} <Link href="/register">{c.register}</Link>
        </div>
      </section>
    </main>
  );
}
