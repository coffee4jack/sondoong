import { useEffect, useState } from "react";
import Button from "../../components/buttons/Button";
import Body from "../../components/portal/Body";
import Card from "../../components/portal/Card";
import Chip from "../../components/portal/Chip";
import Field from "../../components/portal/Field";
import PageHeader from "../../components/portal/PageHeader";
import Toggle from "../../components/portal/Toggle";
import { inputCls } from "../../components/portal/ui";
import { api } from "../../lib/api";
import { money } from "../../lib/beep";
import { cn } from "../../lib/cn";

const empty = {
  id: null,
  name: "",
  category: "",
  categoryId: "",
  price: "",
  stock: 0,
  available: true,
  options: [],
  image: "",
};

const toProduct = (product) => ({
  ...product,
  categoryId: product.category,
  category: product.category_name,
  price: Number(product.price),
});

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState("all");
  const [form, setForm] = useState({ ...empty });
  const [opt, setOpt] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api("/categories/"), api("/products/")])
      .then(([categoryRows, productRows]) => {
        setCategories(categoryRows);
        setProducts(productRows.map(toProduct));
      })
      .catch((err) => setError(`No se pudo cargar el catálogo: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "all", label: "Todos" },
    ...categories.map((item) => ({ id: item.name, label: item.name })),
  ];
  const list = cat === "all" ? products : products.filter((p) => p.category === cat);

  const set = (k, v) => {
    setSaved("");
    setForm((f) => ({ ...f, [k]: v }));
  };

  const toggle = async (id, v) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updated = await api(`/products/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ available: v && product.stock > 0 }),
      });
      const mapped = toProduct(updated);
      setProducts((rows) => rows.map((p) => (p.id === id ? mapped : p)));
      if (form.id === id) setForm(mapped);
      setError("");
    } catch (err) {
      setError(`No se pudo cambiar la disponibilidad: ${err.message}`);
    }
  };

  const addOption = () => {
    const t = opt.trim();
    if (t && !form.options.includes(t)) set("options", [...form.options, t]);
    setOpt("");
  };

  const select = (p) => {
    setForm({ ...p });
    setSaved("");
    setError("");
  };

  const newProduct = () => {
    setForm({ ...empty });
    setSaved("");
  };

  const save = async (e) => {
    e.preventDefault();
    const stock = Math.max(0, Number(form.stock) || 0);
    const categoryId = form.categoryId || categories.find((item) => item.name === form.category)?.id;
    if (!categoryId) {
      setError("Selecciona una categoría antes de guardar.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: Number(categoryId),
      price: Math.max(0, Number(form.price) || 0),
      stock,
      available: stock > 0 && form.available,
      options: form.options,
      image: form.image || "",
    };
    try {
      const result = await api(form.id ? `/products/${form.id}/` : "/products/", {
        method: form.id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const item = toProduct(result);
      setProducts((rows) => form.id
        ? rows.map((product) => product.id === item.id ? item : product)
        : [...rows, item]);
      setForm(item);
      setSaved("Cambios guardados en la base de datos.");
      setError("");
    } catch (err) {
      setError(`No se pudo guardar el producto: ${err.message}`);
    }
  };

  const onImage = (e) => {
    const url = e.target.value;
    set("image", url);
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
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            {loading && <p className="mt-3 text-sm text-ink/65">Cargando catálogo…</p>}
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
                  type="url"
                  placeholder="https://..."
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
                  required
                  value={form.categoryId}
                  className={inputCls}
                  onChange={(e) => {
                    const item = categories.find((category) => String(category.id) === e.target.value);
                    setForm((current) => ({ ...current, categoryId: e.target.value, category: item?.name || "" }));
                  }}
                >
                  <option value="">Selecciona categoría…</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
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
