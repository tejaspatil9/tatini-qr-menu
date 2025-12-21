"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ================= TYPES ================= */

type Addon = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  note?: string;
  isVeg: boolean;
  isAddon?: boolean;
};

/* ================= GOOGLE REVIEW ================= */

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=0x3bc2b9611badad51:0x360a8a00def068e6";

/* ================= MAIN PAGE ================= */

export default function MenuPage() {
  const [table, setTable] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tatini_table");
    if (saved) setTable(Number(saved));
  }, []);

  if (!table) return <TableSelection onSelect={setTable} />;

  return <Menu table={table} />;
}

/* ================= TABLE SELECTION ================= */

function TableSelection({ onSelect }: { onSelect: (n: number) => void }) {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <h1 className="text-lg font-medium mb-2">Select Your Table</h1>
        <p className="text-sm text-gray-500 mb-8">
          Please choose your table number
        </p>

        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((t) => (
            <button
              key={t}
              onClick={() => {
                localStorage.setItem("tatini_table", t.toString());
                onSelect(t);
              }}
              className="py-4 rounded-lg border border-gray-300 text-sm font-medium hover:bg-black hover:text-white transition"
            >
              Table {t}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ================= MENU ================= */

const categories = ["Starters", "Main Course", "Drinks"];

function Menu({ table }: { table: number }) {
  const [active, setActive] = useState("Starters");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const startersRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const drinksRef = useRef<HTMLDivElement | null>(null);

  /* ---------- HELPERS ---------- */

  function getItem(id: string) {
    return cart.find((c) => c.id === id);
  }

  function scrollTo(cat: string) {
    setActive(cat);
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      Starters: startersRef,
      "Main Course": mainRef,
      Drinks: drinksRef,
    };
    map[cat]?.current?.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- CART LOGIC ---------- */

  function addItem(item: Omit<CartItem, "qty">) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty + delta } : p
        )
        .filter((p) => p.qty > 0)
    );
  }

  function updateItemNote(id: string, note: string) {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, note } : p
      )
    );
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalAmount = cart.reduce((s, i) => s + i.qty * i.price, 0);

  function generateOrderText() {
    let text = `🪑 Table ${table}\n\n🧾 Order:\n`;

    cart.forEach((item) => {
      text += `• ${item.name} x${item.qty} — ₹${item.price * item.qty}\n`;
      if (item.note) text += `  ↳ Note: ${item.note}\n`;
    });

    if (orderNote) {
      text += `\n📝 Order Note:\n${orderNote}\n`;
    }

    text += `\n💰 Estimated Total: ₹${totalAmount}`;
    return encodeURIComponent(text);
  }

  function canShowReview() {
    return !sessionStorage.getItem("tatini_review_shown");
  }

  return (
    <main className="min-h-screen bg-white text-black px-4 pb-36">

      {/* HEADER */}
      <header className="sticky top-0 bg-white z-20 pt-5 pb-4 border-b flex justify-between">
        <div>
          <h1 className="text-base font-medium">Tatini Menu</h1>
          <p className="text-xs text-gray-500">Table {table}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("tatini_table");
            location.reload();
          }}
          className="text-xs underline"
        >
          Change
        </button>
      </header>

      {/* CATEGORY BAR */}
      <div className="mt-5 mb-8 flex gap-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollTo(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              active === cat ? "bg-black text-white" : "border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU SECTIONS */}
      <div className="space-y-20">

        {/* STARTERS */}
        <div ref={startersRef}>
          <Category title="Starters">
            <Dish
              id="cc"
              name="Crispy Corn"
              description="Golden fried corn tossed with mild spices."
              price={280}
              img="/menu/crispy-corn.jpg"
              isVeg
              cartItem={getItem("cc")}
              onAdd={addItem}
              onQty={updateQty}
              onNote={updateItemNote}
            />

            <Dish
              id="tc"
              name="Tandoori Chicken"
              description="Juicy chicken marinated overnight and grilled in a tandoor."
              price={520}
              img="/menu/Tandoori-Chicken.jpg"
              isVeg={false}
              addons={[
                { id: "mint", name: "Mint Dip", price: 30 },
                { id: "spice", name: "Extra Spice Rub", price: 20 },
              ]}
              cartItem={getItem("tc")}
              onAdd={addItem}
              onQty={updateQty}
              onNote={updateItemNote}
            />
          </Category>
        </div>

        {/* MAIN COURSE */}
        <div ref={mainRef}>
          <Category title="Main Course">
            <Dish
              id="bpm"
              name="Butter Paneer Masala"
              description="Creamy tomato gravy with butter and spices."
              price={420}
              img="/menu/butter-paneer.jpg"
              isVeg
              cartItem={getItem("bpm")}
              onAdd={addItem}
              onQty={updateQty}
              onNote={updateItemNote}
            />
          </Category>
        </div>

        {/* DRINKS */}
        <div ref={drinksRef}>
          <Category title="Drinks">
            <Dish
              id="vm"
              name="Virgin Mojito"
              description="Refreshing mint and lime cooler."
              price={220}
              img="/menu/mojito.jpg"
              isVeg
              cartItem={getItem("vm")}
              onAdd={addItem}
              onQty={updateQty}
              onNote={updateItemNote}
            />
          </Category>
        </div>

      </div>

      {/* FLOATING CART */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-black text-white py-4 rounded-xl"
          >
            {totalItems} items · ₹{totalAmount} — View Cart
          </button>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-[999]">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium">Your Order</h2>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="mb-4 border-b pb-3">
                <div className="flex justify-between">
                  <p>{item.name}</p>
                  <p>₹{item.price * item.qty}</p>
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => updateQty(item.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>

                <textarea
                  placeholder="Item note"
                  value={item.note || ""}
                  onChange={(e) => updateItemNote(item.id, e.target.value)}
                  className="mt-2 w-full border p-2 text-xs rounded-md"
                />
              </div>
            ))}

            <textarea
              placeholder="Order note (optional)"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full border p-2 text-sm rounded-md"
            />

            <div className="mt-4 font-medium">
              Total: ₹{totalAmount}
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => {
                  setShowCart(false);
                  if (canShowReview()) {
                    sessionStorage.setItem("tatini_review_shown", "true");
                    setTimeout(() => setShowReviewPrompt(true), 400);
                  }
                }}
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Show Order to Waiter
              </button>

              <a
                href={`https://wa.me/917420096566?text=${generateOrderText()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-black py-3 rounded-lg"
              >
                Send Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW PROMPT */}
      {showReviewPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl text-center max-w-sm">
            <h3 className="mb-2 font-medium">
              Thank you for dining with us ✨
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Loved your experience at Tatini?
            </p>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black text-white py-3 rounded-lg"
            >
              ⭐ Leave a Google Review
            </a>

            <button
              onClick={() => setShowReviewPrompt(false)}
              className="mt-3 text-xs underline text-gray-500"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
{/* TABLE OS BRANDING */}
<div className="mt-16 mb-4 text-center text-[11px] text-gray-400">
  <div className="flex items-center justify-center gap-2">
    <img
      src="/tableos-icon.png"
      alt="Table OS"
      className="w-4 h-4 opacity-70"
    />
    <span>
      Powered by <span className="font-medium">Table OS</span>
    </span>
  </div>

  <a
    href="mailto:tableoswork@gmail.com"
    className="underline block mt-1"
  >
    tableoswork@gmail.com
  </a>
</div>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Category({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm text-gray-600 mb-6">{title}</h2>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

function Dish({
  id,
  name,
  description,
  price,
  img,
  isVeg,
  addons = [],
  cartItem,
  onAdd,
  onQty,
  onNote,
}: {
  id: string;
  name: string;
  description: string;
  price: number;
  img: string;
  isVeg: boolean;
  addons?: Addon[];
  cartItem?: CartItem;
  onAdd: (item: Omit<CartItem, "qty">) => void;
  onQty: (id: string, delta: number) => void;
  onNote: (id: string, note: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="relative w-20 h-20 rounded overflow-hidden">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
              <p className="font-medium">{name}</p>
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          <p className="text-sm">₹{price}</p>
        </div>

        {!cartItem ? (
          <button
            onClick={() =>
              onAdd({ id, name, description, price, isVeg })
            }
            className="mt-2 border px-4 py-1 rounded-full text-xs"
          >
            Add
          </button>
        ) : (
          <div className="mt-2 flex gap-3 items-center">
            <button onClick={() => onQty(id, -1)}>−</button>
            <span>{cartItem.qty}</span>
            <button onClick={() => onQty(id, 1)}>+</button>
          </div>
        )}

        {cartItem && addons.length > 0 && (
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">
              Recommended with this
            </p>

            {addons.map((addon) => (
              <button
                key={addon.id}
                onClick={() =>
                  onAdd({
                    id: `${id}-${addon.id}`,
                    name: addon.name,
                    description: `Add-on for ${name}`,
                    price: addon.price,
                    isVeg: true,
                    isAddon: true,
                  })
                }
                className="flex justify-between w-full text-xs border px-3 py-2 rounded-md mb-2"
              >
                <span>+ {addon.name}</span>
                <span>₹{addon.price}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
