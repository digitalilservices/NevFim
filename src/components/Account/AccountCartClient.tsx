"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  History,
  LogOut,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Language } from "@/i18n/translations";

type CartItem = {
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

type OrderItem = CartItem;

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

type CheckoutForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  comment: string;
};

type Props = {
  email: string;
  initialItems: CartItem[];
  initialOrders: Order[];
  initialError: string;
  isAdmin: boolean;
  language: Language;
};

const copy = {
  en: {
    account: "My account",
    admin: "Admin panel",
    back: "Back to site",
    signedIn: "Signed in as",
    cart: "Cart",
    cartDescription: "Selected products with all characteristics.",
    products: "products",
    orders: "My orders",
    ordersDescription: "Open the history of all placed orders.",
    ordersCount: "orders",
    created: "Order created successfully",
    orderNumber: "Order number",
    myCart: "My cart",
    emptyCart: "Your cart is empty",
    emptyCartDescription: "Choose furniture in the constructor and add it here.",
    goConstructor: "Go to constructor",
    size: "Size",
    material: "Material",
    color: "Color",
    fabric: "Fabric",
    quantity: "Quantity",
    customerPrompt: "Customer request",
    deleteProduct: "Remove product",
    deleting: "Removing...",
    total: "Total",
    checkout: "Checkout",
    history: "Order history",
    noOrders: "No orders yet",
    noOrdersDescription: "Placed orders will appear here.",
    recipient: "Recipient",
    phone: "Phone",
    address: "Address",
    comment: "Comment",
    logout: "Log out",
    checkoutTitle: "Checkout",
    checkoutDescription: "Enter contact and delivery information.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    country: "Country",
    city: "City",
    submit: "Confirm order",
    submitting: "Creating order...",
    close: "Close",
    errorDelete: "Could not remove the product.",
    errorOrder: "Could not create the order.",
  },
  cs: {
    account: "Můj účet",
    admin: "Administrace",
    back: "Zpět na web",
    signedIn: "Přihlášen jako",
    cart: "Košík",
    cartDescription: "Vybrané produkty se všemi parametry.",
    products: "produktů",
    orders: "Moje objednávky",
    ordersDescription: "Zobrazit historii všech objednávek.",
    ordersCount: "objednávek",
    created: "Objednávka byla úspěšně vytvořena",
    orderNumber: "Číslo objednávky",
    myCart: "Můj košík",
    emptyCart: "Košík je prázdný",
    emptyCartDescription: "Vyberte nábytek v konfigurátoru a přidejte jej sem.",
    goConstructor: "Přejít do konfigurátoru",
    size: "Rozměr",
    material: "Materiál",
    color: "Barva",
    fabric: "Látka",
    quantity: "Množství",
    customerPrompt: "Požadavek zákazníka",
    deleteProduct: "Odstranit produkt",
    deleting: "Odstraňování...",
    total: "Celkem",
    checkout: "Dokončit objednávku",
    history: "Historie objednávek",
    noOrders: "Zatím žádné objednávky",
    noOrdersDescription: "Objednávky se po odeslání zobrazí zde.",
    recipient: "Příjemce",
    phone: "Telefon",
    address: "Adresa",
    comment: "Poznámka",
    logout: "Odhlásit se",
    checkoutTitle: "Dokončení objednávky",
    checkoutDescription: "Vyplňte kontaktní a doručovací údaje.",
    firstName: "Jméno",
    lastName: "Příjmení",
    email: "Email",
    country: "Země",
    city: "Město",
    submit: "Potvrdit objednávku",
    submitting: "Vytváření objednávky...",
    close: "Zavřít",
    errorDelete: "Produkt se nepodařilo odstranit.",
    errorOrder: "Objednávku se nepodařilo vytvořit.",
  },
  ru: {
    account: "Личный кабинет",
    admin: "Админ-панель",
    back: "Вернуться на сайт",
    signedIn: "Вы вошли как",
    cart: "Корзина",
    cartDescription: "Выбранные товары со всеми характеристиками.",
    products: "товаров",
    orders: "Мои заказы",
    ordersDescription: "Открыть историю всех оформленных заказов.",
    ordersCount: "заказов",
    created: "Заказ успешно создан",
    orderNumber: "Номер заявки",
    myCart: "Моя корзина",
    emptyCart: "Корзина пока пустая",
    emptyCartDescription: "Выберите мебель в конструкторе и добавьте её сюда.",
    goConstructor: "Перейти в конструктор",
    size: "Размер",
    material: "Материал",
    color: "Цвет",
    fabric: "Ткань",
    quantity: "Количество",
    customerPrompt: "Пожелание клиента",
    deleteProduct: "Удалить товар",
    deleting: "Удаляем...",
    total: "Итого",
    checkout: "Оформить заказ",
    history: "История заказов",
    noOrders: "Заказов пока нет",
    noOrdersDescription: "После оформления заказ появится здесь.",
    recipient: "Получатель",
    phone: "Телефон",
    address: "Адрес",
    comment: "Комментарий",
    logout: "Выйти из аккаунта",
    checkoutTitle: "Оформление заказа",
    checkoutDescription: "Заполните контактные данные и адрес доставки.",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "Email",
    country: "Страна",
    city: "Город",
    submit: "Подтвердить заказ",
    submitting: "Создаём заявку...",
    close: "Закрыть",
    errorDelete: "Не удалось удалить товар.",
    errorOrder: "Не удалось оформить заказ.",
  },
} as const;

const emptyForm = (email: string): CheckoutForm => ({
  firstName: "",
  lastName: "",
  phone: "",
  email,
  country: "",
  city: "",
  address: "",
  comment: "",
});

function valueOrDash(value: string | number | null) {
  return value === null || value === "" ? "—" : value;
}

function money(value: number | string, language: Language) {
  const locale =
    language === "cs" ? "cs-CZ" : language === "ru" ? "ru-RU" : "en-US";
  return `${Number(value).toLocaleString(locale)} Kč`;
}

export function AccountCartClient({
  email,
  initialItems,
  initialOrders,
  initialError,
  isAdmin,
  language,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const c = copy[language];
  const ordersRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState(initialItems);
  const [orders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [error, setError] = useState(initialError);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>(() => emptyForm(email));

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  useEffect(() => {
    if (
      searchParams.get("checkout") === "1" &&
      items.length > 0
    ) {
      setIsCheckoutOpen(true);
      router.replace("/account", { scroll: false });
    }
  }, [items.length, router, searchParams]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || c.errorDelete);
      }

      setItems((current) => current.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : c.errorDelete,
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || c.errorOrder);
      }

      setSuccessOrder(data.orderNumber);
      setItems([]);
      setIsCheckoutOpen(false);
      setForm(emptyForm(email));
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : c.errorOrder,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="accountPage accountPageScrollable">
      <section className="accountShell accountShellDark">
        <header className="accountHeader">
          <div>
            <strong className="accountLogo">
              NevFim<span>.grup</span>
            </strong>
            <p>{c.account}</p>
          </div>

          <div className="accountHeaderLinks">
            {isAdmin && <Link href="/admin">{c.admin}</Link>}
            <Link href="/">
              <ArrowLeft size={15} />
              {c.back}
            </Link>
          </div>
        </header>

        <section className="accountWelcome">
          <small>{c.signedIn}</small>
          <h1>{email}</h1>
        </section>

        <div className="accountGrid accountGridTwo">
          <article>
            <ShoppingCart size={22} />
            <h2>{c.cart}</h2>
            <p>{c.cartDescription}</p>
            <strong>
              {items.length} {c.products}
            </strong>
          </article>

          <button
            type="button"
            className="accountOrderHistoryCard"
            onClick={() =>
              ordersRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            <History size={22} />
            <h2>{c.orders}</h2>
            <p>{c.ordersDescription}</p>
            <strong>
              {orders.length} {c.ordersCount}
            </strong>
          </button>
        </div>

        {successOrder && (
          <div className="accountOrderSuccess">
            <CheckCircle2 size={22} />
            <div>
              <strong>{c.created}</strong>
              <span>
                {c.orderNumber}: {successOrder}
              </span>
            </div>
          </div>
        )}

        <section className="accountCartSection" id="cart">
          <div className="accountCartHeading">
            <div>
              <small>NEVFIM CART</small>
              <h2>{c.myCart}</h2>
            </div>
            <strong>{money(total, language)}</strong>
          </div>

          {error && <p className="accountCartError">{error}</p>}

          {items.length === 0 ? (
            <div className="accountEmptyCart">
              <ShoppingCart size={34} />
              <h3>{c.emptyCart}</h3>
              <p>{c.emptyCartDescription}</p>
              <Link href="/">{c.goConstructor}</Link>
            </div>
          ) : (
            <div className="accountCartList">
              {items.map((item) => (
                <article className="accountCartItem" key={item.id}>
                  <div className="accountCartImage">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_code || item.model_name} />
                    ) : (
                      <span>NF</span>
                    )}
                  </div>

                  <div className="accountCartInfo">
                    <div className="accountCartTitle">
                      <div>
                        <small>
                          {item.category_name ?? "NevFim"} ·{" "}
                          {item.source.toUpperCase()}
                        </small>
                        <h3>{item.product_code || item.model_name}</h3>
                      </div>
                      <strong>
                        {money(Number(item.price) * item.quantity, language)}
                      </strong>
                    </div>

                    <div className="accountCartProperties">
                      <span>
                        {c.size}:
                        <b>
                          {valueOrDash(item.width_mm)} ×{" "}
                          {valueOrDash(item.height_mm)} ×{" "}
                          {valueOrDash(item.depth_mm)} mm
                        </b>
                      </span>
                      {item.material && (
                        <span>
                          {c.material}: <b>{item.material}</b>
                        </span>
                      )}
                      {item.color && (
                        <span>
                          {c.color}: <b>{item.color}</b>
                        </span>
                      )}
                      {item.fabric && (
                        <span>
                          {c.fabric}: <b>{item.fabric}</b>
                        </span>
                      )}
                      <span>
                        {c.quantity}: <b>{item.quantity}</b>
                      </span>
                    </div>

                    {item.customer_prompt && (
                      <p className="accountCartPrompt">
                        <small>{c.customerPrompt}</small>
                        {item.customer_prompt}
                      </p>
                    )}

                    <button
                      type="button"
                      className="accountCartDelete"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      <Trash2 size={15} />
                      {deletingId === item.id ? c.deleting : c.deleteProduct}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="accountCheckoutPreview">
              <div>
                <small>{c.total}</small>
                <strong>{money(total, language)}</strong>
              </div>

              <button type="button" onClick={() => setIsCheckoutOpen(true)}>
                {c.checkout}
              </button>
            </div>
          )}
        </section>

        <section className="accountOrdersSection" ref={ordersRef} id="orders">
          <div className="accountOrdersHeading">
            <div>
              <small>NEVFIM HISTORY</small>
              <h2>{c.history}</h2>
            </div>
            <strong>{orders.length}</strong>
          </div>

          {orders.length === 0 ? (
            <div className="accountEmptyOrders">
              <Package size={34} />
              <h3>{c.noOrders}</h3>
              <p>{c.noOrdersDescription}</p>
            </div>
          ) : (
            <div className="accountOrdersList">
              {orders.map((order) => {
                const expanded = expandedOrder === order.id;

                return (
                  <article className="accountOrderCard" key={order.id}>
                    <button
                      type="button"
                      className="accountOrderSummary"
                      onClick={() =>
                        setExpandedOrder(expanded ? null : order.id)
                      }
                    >
                      <div>
                        <small>
                          {new Date(order.created_at).toLocaleString(
                            language === "cs"
                              ? "cs-CZ"
                              : language === "ru"
                                ? "ru-RU"
                                : "en-US",
                          )}
                        </small>
                        <h3>{order.order_number}</h3>
                      </div>

                      <div className="accountOrderSummaryRight">
                        {/* Статус намеренно показывается только администратору, не клиенту. */}
                        <strong>{money(order.total_price, language)}</strong>
                        <ChevronDown
                          size={18}
                          className={expanded ? "isRotated" : ""}
                        />
                      </div>
                    </button>

                    {expanded && (
                      <div className="accountOrderDetails">
                        <div className="accountOrderAddress">
                          <span>{c.recipient}</span>
                          <b>
                            {order.first_name} {order.last_name}
                          </b>
                          <span>{c.phone}</span>
                          <b>{order.phone}</b>
                          <span>{c.address}</span>
                          <b>
                            {order.country}, {order.city}, {order.address}
                          </b>
                          {order.comment && (
                            <>
                              <span>{c.comment}</span>
                              <b>{order.comment}</b>
                            </>
                          )}
                        </div>

                        <div className="accountOrderItems">
                          {order.order_items.map((item) => (
                            <div className="accountOrderItem" key={item.id}>
                              <div className="accountOrderItemImage">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.product_code || item.model_name}
                                  />
                                ) : (
                                  <span>NF</span>
                                )}
                              </div>

                              <div>
                                <small>{item.category_name ?? "NevFim"}</small>
                                <h4>{item.product_code || item.model_name}</h4>
                                <p>
                                  {valueOrDash(item.width_mm)} ×{" "}
                                  {valueOrDash(item.height_mm)} ×{" "}
                                  {valueOrDash(item.depth_mm)} mm
                                </p>
                                {(item.material || item.color || item.fabric) && (
                                  <p>
                                    {[
                                      item.material
                                        ? `${c.material}: ${item.material}`
                                        : "",
                                      item.color
                                        ? `${c.color}: ${item.color}`
                                        : "",
                                      item.fabric
                                        ? `${c.fabric}: ${item.fabric}`
                                        : "",
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </p>
                                )}
                              </div>

                              <strong>
                                {money(
                                  Number(item.price) * item.quantity,
                                  language,
                                )}
                              </strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <form action="/auth/signout" method="post">
          <button className="accountLogout" type="submit">
            <LogOut size={16} />
            {c.logout}
          </button>
        </form>
      </section>

      {isCheckoutOpen && (
        <div
          className="checkoutOverlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsCheckoutOpen(false)}
        >
          <section
            className="checkoutModal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="checkoutClose"
              onClick={() => setIsCheckoutOpen(false)}
              aria-label={c.close}
            >
              ×
            </button>

            <div className="checkoutTitle">
              <small>NEVFIM ORDER</small>
              <h2>{c.checkoutTitle}</h2>
              <p>{c.checkoutDescription}</p>
            </div>

            <form className="checkoutForm" onSubmit={handleSubmitOrder}>
              <div className="checkoutFormGrid">
                <label>
                  {c.firstName}
                  <input
                    required
                    value={form.firstName}
                    onChange={(event) =>
                      setForm({ ...form, firstName: event.target.value })
                    }
                  />
                </label>

                <label>
                  {c.lastName}
                  <input
                    required
                    value={form.lastName}
                    onChange={(event) =>
                      setForm({ ...form, lastName: event.target.value })
                    }
                  />
                </label>

                <label>
                  {c.phone}
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </label>

                <label>
                  {c.email}
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                  />
                </label>

                <label>
                  {c.country}
                  <input
                    required
                    value={form.country}
                    onChange={(event) =>
                      setForm({ ...form, country: event.target.value })
                    }
                  />
                </label>

                <label>
                  {c.city}
                  <input
                    required
                    value={form.city}
                    onChange={(event) =>
                      setForm({ ...form, city: event.target.value })
                    }
                  />
                </label>

                <label className="checkoutFullWidth">
                  {c.address}
                  <input
                    required
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                  />
                </label>

                <label className="checkoutFullWidth">
                  {c.comment}
                  <textarea
                    value={form.comment}
                    onChange={(event) =>
                      setForm({ ...form, comment: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="checkoutTotal">
                <span>{c.total}</span>
                <strong>{money(total, language)}</strong>
              </div>

              <button
                type="submit"
                className="checkoutSubmit"
                disabled={isSubmitting}
              >
                {isSubmitting ? c.submitting : c.submit}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
