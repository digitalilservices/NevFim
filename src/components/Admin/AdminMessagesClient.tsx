"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArchiveRestore,
  Check,
  Mail,
  MessageSquareText,
  Package,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";

import type { Language } from "@/i18n/translations";

type ContactMessage = {
  id: string;
  status: "open" | "closed";
  name: string;
  email: string;
  phone: string;
  message: string;
  language: Language;
  created_at: string;
  closed_at: string | null;
};

type Props = {
  initialMessages: ContactMessage[];
  initialError: string;
};

export function AdminMessagesClient({
  initialMessages,
  initialError,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [error, setError] = useState(initialError);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.status === activeTab),
    [activeTab, messages],
  );

  const openCount = messages.filter((message) => message.status === "open").length;
  const closedCount = messages.filter(
    (message) => message.status === "closed",
  ).length;

  const changeStatus = async (
    messageId: string,
    status: "open" | "closed",
  ) => {
    try {
      setUpdatingId(messageId);
      setError("");

      const response = await fetch(
        `/api/admin/contact-messages/${messageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось изменить обращение.");
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                status,
                closed_at:
                  status === "closed" ? new Date().toISOString() : null,
              }
            : message,
        ),
      );
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Не удалось изменить обращение.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm("Удалить закрытое сообщение навсегда?")) return;

    try {
      setDeletingId(messageId);
      setError("");

      const response = await fetch(
        `/api/admin/contact-messages/${messageId}`,
        { method: "DELETE" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось удалить сообщение.");
      }

      setMessages((current) =>
        current.filter((message) => message.id !== messageId),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Не удалось удалить сообщение.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="adminPage">
      <section className="adminShell">
        <header className="adminHeader">
          <div>
            <strong>
              NevFim<span>.grup</span>
            </strong>
            <p>Админ-панель заявок</p>
          </div>

          <Link href="/account">← Личный кабинет</Link>
        </header>

        <nav className="adminSectionNav" aria-label="Разделы админ-панели">
          <Link href="/admin">
            <Package size={16} />
            Заказы
          </Link>
          <Link className="active" href="/admin/messages">
            <MessageSquareText size={16} />
            Сообщения
          </Link>
        </nav>

        <div className="adminTabs">
          <button
            type="button"
            className={activeTab === "open" ? "active" : ""}
            onClick={() => setActiveTab("open")}
          >
            Новые
            <span>{openCount}</span>
          </button>

          <button
            type="button"
            className={activeTab === "closed" ? "active" : ""}
            onClick={() => setActiveTab("closed")}
          >
            Закрытые
            <span>{closedCount}</span>
          </button>
        </div>

        {error && <p className="adminError">{error}</p>}

        {visibleMessages.length === 0 && (
          <div className="adminEmpty">
            <MessageSquareText size={35} />
            <h2>Сообщений пока нет</h2>
            <p>
              Здесь появятся {activeTab === "open" ? "новые" : "закрытые"}{" "}
              обращения с сайта.
            </p>
          </div>
        )}

        <div className="adminMessagesList">
          {visibleMessages.map((message) => (
            <article className="adminMessageCard" key={message.id}>
              <div className="adminMessageTop">
                <div>
                  <small>
                    {new Date(message.created_at).toLocaleString("ru-RU")}
                  </small>
                  <h2>{message.name}</h2>
                </div>

                <span className="adminMessageLanguage">
                  {message.language.toUpperCase()}
                </span>
              </div>

              <div className="adminMessageContacts">
                <div>
                  <UserRound size={17} />
                  <span>
                    Клиент
                    <b>{message.name}</b>
                  </span>
                </div>

                <div>
                  <Phone size={17} />
                  <span>
                    Телефон
                    <a href={`tel:${message.phone}`}>{message.phone}</a>
                  </span>
                </div>

                <div>
                  <Mail size={17} />
                  <span>
                    Email
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </span>
                </div>
              </div>

              <div className="adminMessageText">
                <small>Сообщение клиента</small>
                <p>{message.message}</p>
              </div>

              <div className="adminOrderActions">
                {message.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => changeStatus(message.id, "closed")}
                    disabled={updatingId === message.id}
                  >
                    <Check size={16} />
                    {updatingId === message.id
                      ? "Закрываем..."
                      : "Закрыть обращение"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="adminRestoreButton"
                      onClick={() => changeStatus(message.id, "open")}
                      disabled={
                        updatingId === message.id || deletingId === message.id
                      }
                    >
                      <ArchiveRestore size={16} />
                      Вернуть в новые
                    </button>

                    <button
                      type="button"
                      className="adminDeleteOrderButton"
                      onClick={() => deleteMessage(message.id)}
                      disabled={
                        deletingId === message.id || updatingId === message.id
                      }
                    >
                      <Trash2 size={16} />
                      {deletingId === message.id
                        ? "Удаляем..."
                        : "Удалить сообщение"}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
