import { Suspense } from "react";

import { CatalogClient } from "@/components/Site/CatalogClient";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <main className="sitePage">
          <div
            style={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              background: "#ffffff",
              color: "#111111",
            }}
          >
            Загрузка каталога...
          </div>
        </main>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
