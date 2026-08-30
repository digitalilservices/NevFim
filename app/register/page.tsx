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
    title: "Create an account",
    description: "Register with your email and password to add furniture to your cart and place orders.",
    password: "Password",
    repeatPassword: "Repeat password",
    passwordHint: "At least 6 characters",
    mismatch: "Passwords do not match.",
    short: "Password must contain at least 6 characters.",
    creating: "Creating account...",
    register: "Register",
    hasAccount: "Already have an account?",
    login: "Log in",
    registrationError: "Could not create the account.",
    emailConfirmationEnabled:
      "Email confirmation is still enabled in Supabase. Disable Confirm email in Authentication settings and try again.",
  },
  cs: {
    back: "Zpět na web",
    account: "Osobní účet",
    title: "Vytvořit účet",
    description: "Zaregistrujte se pomocí emailu a hesla, přidávejte nábytek do košíku a vytvářejte objednávky.",
    password: "Heslo",
    repeatPassword: "Zopakujte heslo",
    passwordHint: "Minimálně 6 znaků",
    mismatch: "Hesla se neshodují.",
    short: "Heslo musí mít alespoň 6 znaků.",
    creating: "Vytváření účtu...",
    register: "Registrovat",
    hasAccount: "Již máte účet?",
    login: "Přihlásit se",
    registrationError: "Účet se nepodařilo vytvořit.",
    emailConfirmationEnabled:
      "V Supabase je stále zapnuté potvrzení emailu. V nastavení Authentication vypněte Confirm email a zkuste to znovu.",
  },
  ru: {
    back: "Вернуться на сайт",
    account: "Личный кабинет",
    title: "Создать аккаунт",
    description: "Зарегистрируйтесь по email и паролю, чтобы добавлять мебель в корзину и оформлять заказы.",
    password: "Пароль",
    repeatPassword: "Повторить пароль",
    passwordHint: "Минимум 6 символов",
    mismatch: "Пароли не совпадают.",
    short: "Пароль должен содержать минимум 6 символов.",
    creating: "Создаём аккаунт...",
    register: "Зарегистрироваться",
    hasAccount: "Уже есть аккаунт?",
    login: "Войти",
    registrationError: "Не удалось создать аккаунт.",
    emailConfirmationEnabled:
      "В Supabase всё ещё включено подтверждение email. Отключите Confirm email в настройках Authentication и попробуйте снова.",
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const { language, isLanguageReady } = useNevFimLanguage();
  const c = copy[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError(c.mismatch);
      return;
    }

    if (password.length < 6) {
      setError(c.short);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            language,
            brand: "NevFim",
          },
        },
      });

      if (signUpError) throw signUpError;

      // With Confirm email disabled in Supabase, signUp immediately returns a session.
      // If there is no session, the project is still configured to require email confirmation.
      if (!data.session) {
        setError(c.emailConfirmationEnabled);
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : c.registrationError);
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

        <form onSubmit={handleRegister} className="authForm">
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={c.passwordHint}
              minLength={6}
              required
            />
          </label>

          <label>
            {c.repeatPassword}
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && <p className="authError">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? c.creating : c.register}
          </button>
        </form>

        <div className="authBottom">
          {c.hasAccount} <Link href="/login">{c.login}</Link>
        </div>
      </section>
    </main>
  );
}
