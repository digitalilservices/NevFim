"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

import { SiteFooter } from "@/components/Site/SiteFooter";
import { SiteHeader } from "@/components/Site/SiteHeader";
import type { Language } from "@/i18n/translations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  company: "",
};

const copy: Record<Language, {
  eyebrow: string;
  title: string;
  description: string;
  formTitle: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  consent: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  callUs: string;
  phoneValue: string;
  writeUs: string;
  addressTitle: string;
  address: string;
  hoursTitle: string;
  hours: string;
  mapEyebrow: string;
  mapTitle: string;
  mapDescription: string;
  openMap: string;
}> = {
  ru: {
    eyebrow: "КОНТАКТЫ NEVFIM",
    title: "Свяжитесь с нами",
    description:
      "Оставьте заявку — мы уточним детали, ответим на вопросы и поможем подобрать мебель для вашего интерьера.",
    formTitle: "Написать нам",
    name: "Ваше имя",
    namePlaceholder: "Введите имя",
    email: "Электронная почта",
    emailPlaceholder: "you@example.com",
    phone: "Ваш телефон",
    phonePlaceholder: "+420 ...",
    message: "Ваше сообщение",
    messagePlaceholder: "Расскажите, какая мебель или консультация вам нужна...",
    consent:
      "Я соглашаюсь на обработку данных для ответа на моё обращение.",
    send: "Отправить сообщение",
    sending: "Отправляем...",
    success: "Спасибо! Сообщение отправлено в админ-панель NevFim.",
    error: "Не удалось отправить сообщение. Проверьте поля и попробуйте ещё раз.",
    callUs: "Позвоните нам",
    phoneValue: "Номер добавим перед запуском",
    writeUs: "Напишите нам",
    addressTitle: "Наш адрес",
    address: "Praha, Česká republika",
    hoursTitle: "Время связи",
    hours: "Пн–Пт, 09:00–18:00",
    mapEyebrow: "NEVFIM В ПРАГЕ",
    mapTitle: "Мы работаем в Праге и по всей Европе",
    mapDescription:
      "На карте указан центр Праги. Точный адрес офиса или шоурума добавим перед официальным запуском.",
    openMap: "Открыть карту",
  },
  cs: {
    eyebrow: "KONTAKTY NEVFIM",
    title: "Kontaktujte nás",
    description:
      "Zanechte nám zprávu — upřesníme detaily, odpovíme na dotazy a pomůžeme vám vybrat nábytek do interiéru.",
    formTitle: "Napište nám",
    name: "Vaše jméno",
    namePlaceholder: "Zadejte jméno",
    email: "E-mail",
    emailPlaceholder: "you@example.com",
    phone: "Váš telefon",
    phonePlaceholder: "+420 ...",
    message: "Vaše zpráva",
    messagePlaceholder: "Napište, jaký nábytek nebo konzultaci potřebujete...",
    consent:
      "Souhlasím se zpracováním údajů za účelem odpovědi na můj dotaz.",
    send: "Odeslat zprávu",
    sending: "Odesílání...",
    success: "Děkujeme! Zpráva byla odeslána do administrace NevFim.",
    error: "Zprávu se nepodařilo odeslat. Zkontrolujte pole a zkuste to znovu.",
    callUs: "Zavolejte nám",
    phoneValue: "Číslo doplníme před spuštěním",
    writeUs: "Napište nám",
    addressTitle: "Naše adresa",
    address: "Praha, Česká republika",
    hoursTitle: "Kontaktní doba",
    hours: "Po–Pá, 09:00–18:00",
    mapEyebrow: "NEVFIM V PRAZE",
    mapTitle: "Působíme v Praze a po celé Evropě",
    mapDescription:
      "Mapa zobrazuje centrum Prahy. Přesnou adresu kanceláře nebo showroomu doplníme před oficiálním spuštěním.",
    openMap: "Otevřít mapu",
  },
  en: {
    eyebrow: "NEVFIM CONTACTS",
    title: "Get in touch",
    description:
      "Leave a message — we will clarify the details, answer your questions and help you choose furniture for your interior.",
    formTitle: "Write to us",
    name: "Your name",
    namePlaceholder: "Enter your name",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    phone: "Your phone",
    phonePlaceholder: "+420 ...",
    message: "Your message",
    messagePlaceholder: "Tell us what furniture or consultation you need...",
    consent:
      "I agree to the processing of my data so NevFim can reply to my enquiry.",
    send: "Send message",
    sending: "Sending...",
    success: "Thank you! Your message was sent to the NevFim admin panel.",
    error: "The message could not be sent. Check the fields and try again.",
    callUs: "Call us",
    phoneValue: "Number will be added before launch",
    writeUs: "Email us",
    addressTitle: "Our address",
    address: "Prague, Czech Republic",
    hoursTitle: "Contact hours",
    hours: "Mon–Fri, 09:00–18:00",
    mapEyebrow: "NEVFIM IN PRAGUE",
    mapTitle: "We operate in Prague and across Europe",
    mapDescription:
      "The map shows central Prague. The exact office or showroom address will be added before the official launch.",
    openMap: "Open map",
  },
};

export default function ContactsPage() {
  const { language } = useNevFimLanguage();
  const c = copy[language];
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (submitState !== "idle") setSubmitState("idle");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language }),
      });

      if (!response.ok) throw new Error("contact_failed");

      setForm(initialForm);
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <main className="sitePage siteContactsPage">
      <SiteHeader />

      <section className="sitePageHero compact siteContactsHero">
        <span>{c.eyebrow}</span>
        <h1>{c.title}</h1>
        <p>{c.description}</p>
      </section>

      <section className="siteContactsShowcase">
        <form className="siteContactForm siteContactFormPremium" onSubmit={submit}>
          <div className="siteContactFormHeader">
            <div>
              <span>NEVFIM FORM</span>
              <h2>{c.formTitle}</h2>
            </div>
            <Send aria-hidden="true" />
          </div>

          <div className="siteFormTwoColumns">
            <label>
              {c.name}
              <input
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={c.namePlaceholder}
                required
              />
            </label>

            <label>
              {c.email}
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={160}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder={c.emailPlaceholder}
                required
              />
            </label>
          </div>

          <label>
            {c.phone}
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              minLength={6}
              maxLength={30}
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder={c.phonePlaceholder}
              required
            />
          </label>

          <label>
            {c.message}
            <textarea
              name="message"
              minLength={10}
              maxLength={3000}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder={c.messagePlaceholder}
              required
            />
          </label>

          <label className="siteContactHoneypot" aria-hidden="true">
            Company
            <input
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </label>

          <label className="siteContactConsent">
            <input type="checkbox" required />
            <span>{c.consent}</span>
          </label>

          <button
            type="submit"
            className="siteButton siteContactSubmit"
            disabled={submitState === "submitting"}
          >
            <span>{submitState === "submitting" ? c.sending : c.send}</span>
            <Send size={17} />
          </button>

          {submitState === "success" && (
            <p className="siteContactNotice success" role="status">
              <ShieldCheck size={18} />
              {c.success}
            </p>
          )}

          {submitState === "error" && (
            <p className="siteContactNotice error" role="alert">
              {c.error}
            </p>
          )}
        </form>

        <aside className="siteContactDetails siteContactDetailsPremium">
          <div className="siteContactBrandMark" aria-hidden="true">
            NF
          </div>

          <div className="siteContactDetailsHeading">
            <span>NEVFIM.GRUP</span>
            <h2>{c.title}</h2>
          </div>

          <a className="siteContactDetailRow" href="tel:+420">
            <span><Phone /></span>
            <div>
              <small>{c.callUs}</small>
              <strong>{c.phoneValue}</strong>
            </div>
          </a>

          <a
            className="siteContactDetailRow"
            href="mailto:illypanferov15@gmail.com"
          >
            <span><Mail /></span>
            <div>
              <small>{c.writeUs}</small>
              <strong>illypanferov15@gmail.com</strong>
            </div>
          </a>

          <div className="siteContactDetailRow">
            <span><MapPin /></span>
            <div>
              <small>{c.addressTitle}</small>
              <strong>{c.address}</strong>
            </div>
          </div>

          <div className="siteContactDetailRow">
            <span><Clock3 /></span>
            <div>
              <small>{c.hoursTitle}</small>
              <strong>{c.hours}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="siteContactMapSection">
        <div className="siteContactMapHeading">
          <div>
            <span>{c.mapEyebrow}</span>
            <h2>{c.mapTitle}</h2>
            <p>{c.mapDescription}</p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Prague%2C+Czech+Republic"
            target="_blank"
            rel="noreferrer"
          >
            {c.openMap}
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="siteContactMapFrame">
          <iframe
            title="NevFim Prague map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=14.3370%2C50.0250%2C14.5380%2C50.1250&layer=mapnik&marker=50.0755%2C14.4378"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="siteContactMapPin" aria-hidden="true">
            <span>NF</span>
            <b>Praha</b>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
