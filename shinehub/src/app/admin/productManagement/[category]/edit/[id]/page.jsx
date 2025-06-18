// src/app/admin/productManagement/[category]/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CategorySidebar from "@/components/admin/CategorySidebar";

export default function EditItemPage() {
  const router = useRouter();
  const { category, id } = useParams();

  // Human‐readable singular
  const pretty = {
    polisher: "Polisher",
    pad:      "Pad",
    compound: "Compound",
  }[category] || "Item";

  // Initial empty shape
  const getInitial = (cat) => {
    switch (cat) {
      case "polisher":
        return {
          name: "", backingpad: "", orbit: "", power: "", rpm: "", weight: "", description: "", imageUrl: "",
        };
      case "pad":
        return { name: "", code: "", size: "", colour: "", description: "" };
      case "compound":
        return { name: "", code: "", size: "", description: "" };
      default:
        return {};
    }
  };

  const [form, setForm] = useState(getInitial(category));
  const [loading, setLoading] = useState(true);

  // fetch existing data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/${category}/${id}`);
        if (res.ok) {
          const data = await res.json();
          // data might be { name, code, … } or { _id, … }
          // if your API wraps it (e.g. { polisher: {...} }) adjust accordingly
          const item = data[category] || data;
          setForm({
            ...getInitial(category),
            ...item,
          });
        } else {
          console.error("Failed to load item");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic required check
    for (let key in form) {
      if (form[key] === "") {
        alert("All fields are required.");
        return;
      }
    }

    // coerce numbers
    let body = { ...form };
    if (category === "polisher") {
      body = {
        ...body,
        backingpad: parseFloat(body.backingpad),
        orbit:      parseFloat(body.orbit),
        power:      parseFloat(body.power),
        weight:     parseFloat(body.weight),
      };
    } else {
      body = { ...body, size: parseFloat(body.size) };
    }

    const res = await fetch(`/api/${category}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      window.alert(`${pretty} updated successfully.`);
      router.push(`/admin/productManagement/${category}`);
    } else {
      console.error(await res.text());
      alert("Failed to update.");
    }
  };

  if (loading) {
    return <p className="p-6">Loading…</p>;
  }

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6 bg-purple-50">
        <h1 className="text-2xl font-semibold mb-4">
          Edit {pretty}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4 max-w-lg"
        >
          {category === "polisher" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="backingpad"
                value={form.backingpad}
                onChange={handleChange}
                type="number"
                placeholder="Backing Pad (in)"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="orbit"
                value={form.orbit}
                onChange={handleChange}
                type="number"
                placeholder="Orbit (mm)"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="power"
                value={form.power}
                onChange={handleChange}
                type="number"
                placeholder="Power (W)"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="rpm"
                value={form.rpm}
                onChange={handleChange}
                placeholder="RPM"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                type="number"
                placeholder="Weight (kg)"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}

          {category === "pad" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Code"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                type="number"
                placeholder="Size"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="colour"
                value={form.colour}
                onChange={handleChange}
                placeholder="Colour"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}

          {category === "compound" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Code"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                type="number"
                placeholder="Size"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full border px-3 py-2 rounded"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
