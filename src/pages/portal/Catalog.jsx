import { useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import Field from "../../components/portal/Field";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { inputCls } from "../../components/portal/ui";
import { categories, initialProducts } from "../../data/portal";
import { money } from "../../lib/beep";
import { cn } from "../../lib/cn";

const empty = {
  id: null,
  name: "",
  category: categories[0],
  price: 0,
  stock: 0,
  available: true,
  options: [],
  image: "",
};

const tabs = [{ id: "all", label: "Todos" }, ...categories.map((c) => ({ id: c, label: c }))];

export default function Catalog() {
  const [products, setProducts] = useState(() => [...initialProducts]);
  const [cat, setCat] = useState("all");
  const [form, setForm] = useState(() => ({ ...initialProducts[0] }));
  const [opt, setOpt] = useState("");
  const [saved, setSaved] = useState("");

  const list = cat === "all" ? products : products.filter((p) => p.category === cat);

  const set = (k, v) => {
    setSaved("");
    setForm((f) => ({ ...f, [k]: v }));
  };

  const toggle = (id, v) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, available: v && p.stock > 0 } : p)));
  };

  const addOption = () => {
    const t = opt.trim();
    if (t && !form.options.includes(t)) set("options", [...form.options, t]);
    setOpt("");
  };

  const select = (p) => {
    setForm(p);
    setSaved("");
  };

  const newProduct = () => {
    setForm({ ...empty });
    setSaved("");
  };

  const onImage = (e) => {
    const file = e.target.files[0];
    if (file) set("image", URL.createObjectURL(file));
  };

  const save = (e) => {
    e.preventDefault();
    const stock = Math.max(0, Number(form.stock) || 0);
    const item = {
      ...form,
      price: Math.max(0, Number(form.price) || 0),
      stock,
      available: stock > 0 && form.available,
    };
    if (item.id == null) {
      item.id = Date.now();
      setProducts((ps) => [...ps, item]);
    } else {
      setProducts((ps) => ps.map((x) => (x.id === item.id ? item : x)));
    }
    setForm(item);
    setSaved("Cambios guardados.");
  };

  return (
    <>
      <PageHeader
        tabs={tabs}
        active={cat}
        onTab={setCat}
        action={
          <Button size="sm" onClick={newProduct}>
            + Agregar producto
          </Button>
        }
      />
      <Body>
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
          <section aria-label="Productos">
            <h2 className="text-2xl font-bold">Productos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {list.map((p) => (
                <Card key={p.id} className={cn(form.id === p.id && "ring-2 ring-brand")}>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => select(p)}
                  >
                    {p.image ? (
                      <img src={p.image} alt="" className="h-28 w-full rounded-2xl object-cover" />
                    ) : (
                      <span className="grid h-28 place-items-center rounded-2xl border border-ink/10 bg-white text-xs uppercase tracking-wide text-ink/60">
                        Imagen
                      </span>
                    )}
                    <b className="mt-2.5 block">{p.name}</b>
                    <span className="text-[13px] text-ink/65">
                      {money(p.price)} · {p.stock} en stock
                    </span>
                  </button>
                  <div className="mt-3 flex items-center justify-between">
                    <Chip tone={p.available ? "brand" : "dark"}>
                      {p.available ? "Disponible" : "Agotado"}
                    </Chip>
                    <Toggle
                      checked={p.available}
                      label={`Disponibilidad de ${p.name}`}
                      onChange={(v) => toggle(p.id, v)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card as="form" aria-label="Editar producto" onSubmit={save}>
            <h2 className="text-lg font-bold">
              {form.id == null ? "Nuevo producto" : "Editar producto"}
            </h2>
            <div className="mt-3 space-y-3">
              {form.image && (
                <img src={form.image} alt="" className="h-24 w-full rounded-2xl object-cover" />
              )}
              <Field label="Imagen">
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-white"
                  onChange={onImage}
                />
              </Field>
              <Field label="Nombre">
                <input
                  required
                  value={form.name}
                  className={inputCls}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Categoría">
                <select
                  value={form.category}
                  className={inputCls}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Precio (L)">
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    className={inputCls}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </Field>
                <Field label="Existencias">
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    className={inputCls}
                    onChange={(e) => set("stock", e.target.value)}
                  />
                </Field>
              </div>
              <div>
                <p className="text-sm text-ink/70">Opciones</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {form.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      aria-label={`Quitar ${o}`}
                      onClick={() =>
                        set(
                          "options",
                          form.options.filter((x) => x !== o)
                        )
                      }
                    >
                      <Chip tone="dark">{o} ×</Chip>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={opt}
                    onChange={(e) => setOpt(e.target.value)}
                    aria-label="Nueva opción"
                    placeholder="Ej. Extra queso +L 15"
                    className={inputCls}
                  />
                  <Button size="sm" variant="outline" className="h-11" onClick={addOption}>
                    Añadir
                  </Button>
                </div>
              </div>
              <p className="text-[13px] text-ink/65">
                Los cambios aplican según los permisos de tu rol.
              </p>
              <Button type="submit" className="w-full">
                Guardar cambios
              </Button>
              {saved && (
                <p role="status" className="text-sm">
                  {saved}
                </p>
              )}
            </div>
          </Card>
        </div>
      </Body>
    </>
  );
}
