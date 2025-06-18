"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategorySidebar from "@/components/admin/CategorySidebar";

export default function AddItemPage() {
  const { category } = useParams();
  const router = useRouter();

  // Human-friendly titles
  const pretty = {
    polisher: "Polisher",
    pad:      "Pad",
    compound: "Compound",
  }[category] || "Item";

  // Initial form state per category
  const getInitial = (cat) => {
    switch (cat) {
      case "polisher":
        return {
          name: "",
          backingpad: "",
          orbit: "",
          power: "",
          rpm: "",
          weight: "",
          description: "",
          imageUrl: "",
        };
      case "pad":
        return {
          name: "",
          code: "",
          size: "",
          colour: "",
          description: "",
        };
      case "compound":
        return {
          name: "",
          code: "",
          size: "",
          description: "",
        };
      default:
        return {};
    }
  };

  const [form, setForm] = useState(getInitial(category));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // simple required-fields check
    for (let key in form) {
      if (form[key] === "") {
        alert("All fields are required.");
        return;
      }
    }

    // convert numeric fields
    let body = { ...form };
    if (category === "polisher") {
      body = {
        ...body,
        backingpad: parseFloat(body.backingpad),
        orbit:      parseFloat(body.orbit),
        power:      parseFloat(body.power),
        weight:     parseFloat(body.weight),
      };
    } else if (category === "pad" || category === "compound") {
      body = {
        ...body,
        size: parseFloat(body.size),
      };
    }

    const res = await fetch(`/api/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      window.alert(`${pretty} added successfully.`);
      router.push(`/admin/productManagement/${category}`);
    } else {
      const err = await res.json();
      console.error(err);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6 bg-purple-50">
        <h1 className="text-2xl font-semibold mb-4">Add a new {pretty}</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4 max-w-lg"
        >
          {/* Polisher fields */}
          {category === "polisher" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Name"
              />
              <input
                name="backingpad"
                value={form.backingpad}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Backing Pad (inch)"
                type="number"
              />
              <input
                name="orbit"
                value={form.orbit}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Orbit (mm)"
                type="number"
              />
              <input
                name="power"
                value={form.power}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Power (W)"
                type="number"
              />
              <input
                name="rpm"
                value={form.rpm}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="RPM"
              />
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Weight (kg)"
                type="number"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Image URL"
              />
            </>
          )}

          {/* Pad fields */}
          {category === "pad" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Name"
              />
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Code"
              />
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Size (mm)"
                type="number"
              />
              <input
                name="colour"
                value={form.colour}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Colour"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
              />
            </>
          )}

          {/* Compound fields */}
          {category === "compound" && (
            <>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Name"
              />
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Code"
              />
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Size (g)"
                type="number"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
              />
            </>
          )}

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add {pretty}
          </button>
        </form>
      </main>
    </div>
  );
}
