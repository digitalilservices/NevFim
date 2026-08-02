"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
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
      const target = event.target as Node;
      const clickedButton = rootRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);

      if (!clickedButton && !clickedDropdown) {
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

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const isMobile = window.matchMedia("(max-width: 720px)").matches;

      if (isMobile) {
        const header = document.querySelector<HTMLElement>(".siteHeader");
        const headerBottom = header?.getBoundingClientRect().bottom ?? rect.bottom;

        setDropdownStyle({
          position: "fixed",
          top: Math.max(headerBottom + 10, 96),
          left: 14,
          right: 14,
          width: "auto",
        });
      } else {
        const width = 300;
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 9,
          left: Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12)),
          width,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div className="accountMenu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="accountMenuButton"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <UserRound size={17} />
        <span>{email ? email.split("@")[0] : copy.account}</span>
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          <button
            type="button"
            className="accountMenuBackdrop"
            onClick={() => setIsOpen(false)}
            aria-label="Close account menu"
          />
          <div
            ref={dropdownRef}
            className="accountMenuDropdown accountMenuDropdownPortal"
            role="menu"
            style={dropdownStyle}
          >
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
        </>,
        document.body,
      )}
    </div>
  );
}
