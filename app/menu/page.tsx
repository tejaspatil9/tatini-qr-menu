"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ================= TYPES ================= */

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  note?: string;
};

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

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=0x3bc2b9611badad51:0x360a8a00def068e6";

function Menu({ table }: { table: number }) {
  const [active, setActive] = useState("Starters");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const startersRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const drinksRef = useRef<HTMLDivElement | null>(null);

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

  function getItem(id: string) {
    return cart.find((c) => c.id === id);
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

  return (
    <main className="min-h-screen bg-white text-black px-4 pb-36">

      {/* HEADER */}
      <header className="sticky top-0 bg-white z-20 pt-5 pb-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-base font-medium">Tatini Menu</h1>
          <p className="text-xs text-gray-500">Table {table}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("tatini_table");
            window.location.reload();
          }}
          className="text-xs underline text-gray-600"
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
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              active === cat
                ? "bg-black text-white"
                : "border border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU CONTENT */}
      <div className="space-y-20">

        <div ref={startersRef}>
          <Category title="Starters">
            <Dish id="cc" name="Crispy Corn" description="Golden fried corn tossed with mild spices and herbs." price={280} img="/menu/crispy-corn.jpg" cartItem={getItem("cc")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
            <Dish id="pt" name="Paneer Tikka" description="Char-grilled cottage cheese marinated in aromatic spices." price={360} img="/menu/paneer-tikka.jpg" cartItem={getItem("pt")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
          </Category>
        </div>

        <div ref={mainRef}>
          <Category title="Main Course">
            <Dish id="bpm" name="Butter Paneer Masala" description="Rich tomato gravy finished with butter and cream." price={420} img="/menu/butter-paneer.jpg" cartItem={getItem("bpm")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
            <Dish id="dm" name="Dal Makhani" description="Slow-cooked black lentils with butter and spices." price={340} img="/menu/dal-makhani.jpg" cartItem={getItem("dm")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
          </Category>
        </div>

        <div ref={drinksRef}>
          <Category title="Drinks">
            <Dish id="vm" name="Virgin Mojito" description="Refreshing mint and lime cooler." price={220} img="/menu/mojito.jpg" cartItem={getItem("vm")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
            <Dish id="cf" name="Cold Coffee" description="Chilled coffee blended with milk and ice." price={240} img="/menu/cold-coffee.jpg" cartItem={getItem("cf")} onAdd={addItem} onQty={updateQty} onNote={updateItemNote} />
          </Category>
        </div>

      </div>

      {/* FLOATING CART BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="bg-black text-white rounded-xl px-5 py-4 flex justify-between items-center shadow-lg">
            <span className="text-sm">
              {totalItems} items · ₹{totalAmount}
            </span>
            <button
              onClick={() => setShowCart(true)}
              className="text-sm underline"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium">Your Order</h2>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="mb-5 border-b pb-4">
                <div className="flex justify-between">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-sm">₹{item.price * item.qty}</p>
                </div>

                {item.note && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: {item.note}
                  </p>
                )}

                <div className="flex gap-4 items-center mt-2">
                  <button onClick={() => updateQty(item.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
            ))}

            <textarea
              placeholder="Add note for the whole order (optional)"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full border rounded-md p-3 text-sm"
            />

            <div className="mt-6 flex justify-between font-medium">
              <span>Estimated Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setShowCart(false);
                  setShowReviewPrompt(true);
                }}
                className="w-full bg-black text-white py-3 rounded-lg text-sm"
              >
                Show Order to Waiter
              </button>

              <a
                href={`https://wa.me/917420096566?text=${generateOrderText()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-black text-black py-3 rounded-lg text-sm"
              >
                Send Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE REVIEW PROMPT */}
      {showReviewPrompt && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center px-6">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 text-center">
            <h3 className="text-base font-medium mb-2">
              Thank you for dining with us ✨
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              If you enjoyed your experience at Tatini,
              we’d love to hear your feedback.
            </p>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-3 rounded-lg text-sm mb-3"
            >
              ⭐ Leave a Google Review
            </a>

            <button
              onClick={() => setShowReviewPrompt(false)}
              className="text-sm text-gray-500 underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

/* ================= UI COMPONENTS ================= */

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
      <div className="space-y-10">{children}</div>
    </div>
  );
}

function Dish({
  id,
  name,
  description,
  price,
  img,
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
  cartItem?: CartItem;
  onAdd: (item: Omit<CartItem, "qty">) => void;
  onQty: (id: string, delta: number) => void;
  onNote: (id: string, note: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <div className="pr-4">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
          <p className="text-sm whitespace-nowrap">₹{price}</p>
        </div>

        {!cartItem ? (
          <button
            onClick={() => onAdd({ id, name, description, price })}
            className="mt-2 px-4 py-1.5 text-xs border rounded-full"
          >
            Add
          </button>
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => onQty(id, -1)}>−</button>
            <span>{cartItem.qty}</span>
            <button onClick={() => onQty(id, 1)}>+</button>
          </div>
        )}

        {cartItem && (
          <textarea
            placeholder="Add note (e.g. less spicy)"
            value={cartItem.note || ""}
            onChange={(e) => onNote(id, e.target.value)}
            className="mt-3 w-full text-xs border rounded-md p-2"
          />
        )}
      </div>
    </div>
  );
}
