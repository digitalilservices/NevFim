"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogIn, ShoppingCart, UserRound, UserPlus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import type { Language } from "@/i18n/translations";

type AccountButtonProps = {
  language: Language;
};

const labels = {
  en: {
    account: "My account",
    signedIn: "Signed in",
    openAccount: "Open account",
    cart: "Cart",
    login: "Log in",
    register: "Register",
  },
  cs: {
    account: "Můj účet",
    signedIn: "Přihlášen",
    openAccount: "Otevřít účet",
    cart: "Košík",
    login: "Přihlásit se",
    register: "Registrovat",
  },
  ru: {
    account: "Личный кабинет",
    signedIn: "Вы вошли как",
    openAccount: "Открыть кабинет",
    cart: "Корзина",
    login: "Войти",
    register: "Регистрация",
  },
} as const;

export function AccountButton({ language }: AccountButtonProps) {
  const supabaseRef = useRef(createClient());
  const [email, setEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const copy = labels[language];

  useEffect(() => {
    const supabase = supabaseRef.current;

    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setIsReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setIsReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="accountMenu" ref={rootRef}>
      <button
        type="button"
        className="accountMenuButton"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <UserRound size={17} />
        <span>{email ? email.split("@")[0] : copy.account}</span>
      </button>

      {isOpen && (
        <div className="accountMenuDropdown" role="menu">
          {!isReady ? (
            <div className="accountMenuLoading">...</div>
          ) : email ? (
            <>
              <div className="accountMenuIdentity">
                <small>{copy.signedIn}</small>
                <strong>{email}</strong>
              </div>

              <Link href="/account" onClick={() => setIsOpen(false)}>
                <UserRound size={16} />
                {copy.openAccount}
              </Link>

              <Link href="/account#cart" onClick={() => setIsOpen(false)}>
                <ShoppingCart size={16} />
                {copy.cart}
              </Link>
            </>
          ) : (
            <>
              <div className="accountMenuIdentity">
                <small>NevFim.grup</small>
                <strong>{copy.account}</strong>
              </div>

              <Link href="/login" onClick={() => setIsOpen(false)}>
                <LogIn size={16} />
                {copy.login}
              </Link>

              <Link
                href="/register"
                className="accountMenuRegister"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus size={16} />
                {copy.register}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
