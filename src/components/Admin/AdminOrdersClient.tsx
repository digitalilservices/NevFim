"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArchiveRestore,
  Check,
  Mail,
  MapPin,
  MessageSquareText,
  Package,
  Phone,
  UserRound,
  Trash2,
} from "lucide-react";

type OrderItem = {
  id: string;
  source: string;
  category_name: string | null;
  product_code: string | null;
  model_name: string;
  image_url: string | null;
  width_mm: number | null;
  height_mm: number | null;
  depth_mm: number | null;
  material: string | null;
  color: string | null;
  fabric: string | null;
  customer_prompt: string | null;
  price: number | string;
  quantity: number;
};

type Order = {
  id: string;
  order_number: string;
  status: "open" | "closed";
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  comment: string | null;
  total_price: number | string;
  created_at: string;
  closed_at: string | null;
  order_items: OrderItem[];
};

type Props = {
  initialOrders: Order[];
  initialError: string;
};

export function AdminOrdersClient({
  initialOrders,
  initialError,
}: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [error, setError] = useState(initialError);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visibleOrders = useMemo(
    () => orders.filter((order) => order.status === activeTab),
    [orders, activeTab],
  );

  const openCount = orders.filter((order) => order.status === "open").length;
  const closedCount = orders.filter((order) => order.status === "closed").length;

  const changeStatus = async (
    orderId: string,
    status: "open" | "closed",
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await fetch(`/api/admin/orders/${orderId}/close`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось изменить заявку.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                closed_at:
                  status === "closed" ? new Date().toISOString() : null,
              }
            : order,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Не удалось изменить заявку.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteClosedOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Удалить закрытый заказ навсегда? Восстановить его будет невозможно.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(orderId);
      setError("");

      const response = await fetch(`/api/admin/orders/${orderId}/close`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось удалить заказ.");
      }

      setOrders((current) => current.filter((order) => order.id !== orderId));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Не удалось удалить заказ.",
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
          <Link className="active" href="/admin">
            <Package size={16} />
            Заказы
          </Link>
          <Link href="/messages">
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
            Открытые
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

        {visibleOrders.length === 0 && (
          <div className="adminEmpty">
            <Package size={35} />
            <h2>Заявок пока нет</h2>
            <p>
              Здесь появятся {activeTab === "open" ? "новые" : "закрытые"}{" "}
              заказы.
            </p>
          </div>
        )}

        <div className="adminOrdersList">
          {visibleOrders.map((order) => (
            <article className="adminOrderCard" key={order.id}>
              <div className="adminOrderTop">
                <div>
                  <small>
                    {new Date(order.created_at).toLocaleString("ru-RU")}
                  </small>
                  <h2>{order.order_number}</h2>
                </div>

                <strong>
                  {Number(order.total_price).toLocaleString("cs-CZ")} Kč
                </strong>
              </div>

              <div className="adminCustomerGrid">
                <div>
                  <UserRound size={17} />
                  <span>
                    Клиент
                    <b>
                      {order.first_name} {order.last_name}
                    </b>
                  </span>
                </div>

                <div>
                  <Phone size={17} />
                  <span>
                    Телефон
                    <a href={`tel:${order.phone}`}>{order.phone}</a>
                  </span>
                </div>

                <div>
                  <Mail size={17} />
                  <span>
                    Email
                    <a href={`mailto:${order.email}`}>{order.email}</a>
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>
                    Адрес
                    <b>
                      {order.country}, {order.city}, {order.address}
                    </b>
                  </span>
                </div>
              </div>

              {order.comment && (
                <div className="adminOrderComment">
                  <small>Комментарий клиента</small>
                  <p>{order.comment}</p>
                </div>
              )}

              <div className="adminOrderItems">
                {order.order_items.map((item) => (
                  <div className="adminOrderItem" key={item.id}>
                    <div className="adminOrderItemImage">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.model_name} />
                      ) : (
                        <span>NF</span>
                      )}
                    </div>

                    <div>
                      <small>
                        {item.category_name ?? "Мебель"} ·{" "}
                        {item.source.toUpperCase()}
                      </small>
                      <h3>{item.product_code ?? item.model_name}</h3>

                      <p>
                        {item.width_mm ?? "—"} × {item.height_mm ?? "—"} ×{" "}
                        {item.depth_mm ?? "—"} мм
                      </p>
                      <p>
                        Материал: {item.material || "—"} · Цвет:{" "}
                        {item.color || "—"}
                        {item.fabric ? ` · Ткань: ${item.fabric}` : ""}
                      </p>

                      {item.customer_prompt && (
                        <blockquote>{item.customer_prompt}</blockquote>
                      )}
                    </div>

                    <strong>
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "ru-RU",
                      )}{" "}
                      Kč
                    </strong>
                  </div>
                ))}
              </div>

              <div className="adminOrderActions">
                {order.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, "closed")}
                    disabled={updatingId === order.id}
                  >
                    <Check size={16} />
                    {updatingId === order.id
                      ? "Закрываем..."
                      : "Закрыть заявку"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="adminRestoreButton"
                      onClick={() => changeStatus(order.id, "open")}
                      disabled={updatingId === order.id || deletingId === order.id}
                    >
                      <ArchiveRestore size={16} />
                      Вернуть в открытые
                    </button>

                    <button
                      type="button"
                      className="adminDeleteOrderButton"
                      onClick={() => deleteClosedOrder(order.id)}
                      disabled={deletingId === order.id || updatingId === order.id}
                    >
                      <Trash2 size={16} />
                      {deletingId === order.id ? "Удаляем..." : "Удалить заказ"}
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
