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
    description: "Register to add furniture to your cart and place orders.",
    password: "Password",
    repeatPassword: "Repeat password",
    passwordHint: "At least 6 characters",
    mismatch: "Passwords do not match.",
    short: "Password must contain at least 6 characters.",
    creating: "Creating account...",
    register: "Register",
    hasAccount: "Already have an account?",
    login: "Log in",
    verifyTitle: "Confirm your email",
    verifyDescription: "We sent a six-digit confirmation code to:",
    codeLabel: "Confirmation code",
    codeHint: "Enter all 6 digits from the NevFim email.",
    confirming: "Checking code...",
    confirm: "Confirm registration",
    resend: "Send code again",
    resending: "Sending...",
    resent: "A new code has been sent.",
    changeEmail: "Use another email",
    registrationError: "Could not create the account.",
    verificationError: "The code is invalid or expired.",
    resendError: "Could not send a new code.",
    confirmed: "Email confirmed. Your NevFim account is ready.",
    confirmationRequired: "Email confirmation must be enabled in Supabase.",
  },
  cs: {
    back: "Zpět na web",
    account: "Osobní účet",
    title: "Vytvořit účet",
    description: "Zaregistrujte se, přidávejte nábytek do košíku a vytvářejte objednávky.",
    password: "Heslo",
    repeatPassword: "Zopakujte heslo",
    passwordHint: "Minimálně 6 znaků",
    mismatch: "Hesla se neshodují.",
    short: "Heslo musí mít alespoň 6 znaků.",
    creating: "Vytváření účtu...",
    register: "Registrovat",
    hasAccount: "Již máte účet?",
    login: "Přihlásit se",
    verifyTitle: "Potvrďte svůj email",
    verifyDescription: "Na tuto adresu jsme poslali šestimístný potvrzovací kód:",
    codeLabel: "Potvrzovací kód",
    codeHint: "Zadejte všech 6 číslic z emailu NevFim.",
    confirming: "Ověřování kódu...",
    confirm: "Potvrdit registraci",
    resend: "Poslat kód znovu",
    resending: "Odesílání...",
    resent: "Nový kód byl odeslán.",
    changeEmail: "Použít jiný email",
    registrationError: "Účet se nepodařilo vytvořit.",
    verificationError: "Kód je neplatný nebo vypršel.",
    resendError: "Nový kód se nepodařilo odeslat.",
    confirmed: "Email byl potvrzen. Váš účet NevFim je připraven.",
    confirmationRequired: "V Supabase musí být zapnuté potvrzení emailu.",
  },
  ru: {
    back: "Вернуться на сайт",
    account: "Личный кабинет",
    title: "Создать аккаунт",
    description: "Зарегистрируйтесь, чтобы добавлять мебель в корзину и оформлять заказы.",
    password: "Пароль",
    repeatPassword: "Повторить пароль",
    passwordHint: "Минимум 6 символов",
    mismatch: "Пароли не совпадают.",
    short: "Пароль должен содержать минимум 6 символов.",
    creating: "Создаём аккаунт...",
    register: "Зарегистрироваться",
    hasAccount: "Уже есть аккаунт?",
    login: "Войти",
    verifyTitle: "Подтвердите email",
    verifyDescription: "Мы отправили шестизначный код подтверждения на:",
    codeLabel: "Код подтверждения",
    codeHint: "Введите все 6 цифр из письма NevFim.",
    confirming: "Проверяем код...",
    confirm: "Подтвердить регистрацию",
    resend: "Отправить код ещё раз",
    resending: "Отправляем...",
    resent: "Новый код отправлен.",
    changeEmail: "Указать другой email",
    registrationError: "Не удалось создать аккаунт.",
    verificationError: "Код неверный или срок его действия истёк.",
    resendError: "Не удалось отправить новый код.",
    confirmed: "Email подтверждён. Аккаунт NevFim готов.",
    confirmationRequired: "В Supabase должно быть включено подтверждение email.",
  },
} as const;

type Step = "register" | "verify" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const { language, isLanguageReady } = useNevFimLanguage();
  const c = copy[language];

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage("");

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

      if (data.session) {
        await supabase.auth.signOut();
        setError(c.confirmationRequired);
        return;
      }

      setPendingEmail(cleanEmail);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : c.registrationError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.length !== 6) {
      setError(c.verificationError);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: code,
        type: "email",
      });

      if (verifyError) throw verifyError;

      setStep("success");
      setMessage(c.confirmed);

      window.setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 900);
    } catch {
      setError(c.verificationError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setError("");
      setMessage("");

      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });

      if (resendError) throw resendError;
      setMessage(c.resent);
    } catch {
      setError(c.resendError);
    } finally {
      setIsResending(false);
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

        {step === "register" && (
          <>
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
          </>
        )}

        {step === "verify" && (
          <>
            <div className="authOtpBadge">6</div>
            <h1>{c.verifyTitle}</h1>
            <p className="authDescription">
              {c.verifyDescription}
              <strong className="authPendingEmail">{pendingEmail}</strong>
            </p>

            <form onSubmit={handleVerify} className="authForm">
              <label>
                {c.codeLabel}
                <input
                  className="authOtpInput"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                  autoFocus
                />
              </label>

              <small className="authOtpHint">{c.codeHint}</small>

              {error && <p className="authError">{error}</p>}
              {message && <p className="authSuccess">{message}</p>}

              <button type="submit" disabled={isLoading || code.length !== 6}>
                {isLoading ? c.confirming : c.confirm}
              </button>
            </form>

            <div className="authOtpActions">
              <button type="button" onClick={handleResend} disabled={isResending}>
                {isResending ? c.resending : c.resend}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("register");
                  setPendingEmail("");
                  setCode("");
                  setError("");
                  setMessage("");
                }}
              >
                {c.changeEmail}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="authVerificationSuccess">
            <span>✓</span>
            <h1>{c.confirmed}</h1>
            <p>{pendingEmail}</p>
          </div>
        )}
      </section>
    </main>
  );
}
