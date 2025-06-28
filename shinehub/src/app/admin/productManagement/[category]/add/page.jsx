"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategorySidebar from "@/components/admin/CategorySidebar";
import { CldUploadButton } from 'next-cloudinary';
import Image from "next/image";

export default function AddItemPage() {
  const { category } = useParams();
  const router = useRouter();

  const pretty = {
    polisher: "Polisher",
    pad:      "Pad",
    compound: "Compound",
  }[category] || "Item";

  const getInitial = (cat) => {
    switch (cat) {
      case "polisher":
        return { name: "", backingpad: "", orbit: "", power: "", rpm: "", weight: "", type: "", description: "", featured: false, images: [] };
      case "pad":
        return { name: "", code: "", size: "", properties: "", colour: "", type: "", description: "", featured: false, images: [] };
      case "compound":
        return { name: "", code: "", size: "", properties: "", type: "", description: "", featured: false, images: [] };
      default:
        return {};
    }
  };

  const [form, setForm] = useState(getInitial(category));
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (result) => {
    const info = result.info;
    if (info.secure_url && info.public_id) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, { url: info.secure_url, publicId: info.public_id }],
      }));
    }
  };

  const handleRemoveImage = async (publicIdToRemove) => {
    await fetch('/api/removeImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: publicIdToRemove })
    });
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.publicId !== publicIdToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in form) {
      if (key !== 'images' && form[key] === "") {
        alert("All fields are required.");
        return;
      }
    }
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
      body.size = parseFloat(body.size);
    }

    const res = await fetch(`/api/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`${pretty} added successfully.`);
      router.push(`/admin/productManagement/${category}`);
    } else {
      console.error(await res.text());
      alert("Failed to add item.");
    }
  };

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6">
        <div className="flex flex-col items-center bg-purple-50 rounded-lg p-6 mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold mb-4 text-purple-600">
            Add a new {pretty}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-4 w-full text-left"
          >

          {category === "polisher" && (
            <>
          <div className="flex flex-wrap gap-2">
              {form.images.map(img => (
                <div key={img.publicId} className="relative w-24 h-24">
                  <Image src={img.url} fill className="object-cover rounded" alt="" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.publicId)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

          <div className="mb-4 text-sm text-center">
              <CldUploadButton
              uploadPreset="polisher"
                onSuccess={handleImageUpload}
                options={{ multiple: true, maxFiles: 5 }}
                className="underline text-black"
              >
              Upload Images
            </CldUploadButton>
          </div>
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
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Type"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleCheckBoxChange}
                  className="h-4 w-4"
                />
                <span className="select-none">Featured</span>
              </label>
            </>
          )}

          {category === "pad" && (
            <>
            <div className="flex flex-wrap gap-2">
            {form.images.map(img => (
              <div key={img.publicId} className="relative w-24 h-24">
                <Image src={img.url} fill className="object-cover rounded" alt="" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.publicId)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4 text-sm text-center">
            <CldUploadButton
              uploadPreset="polishingpad"
              onSuccess={handleImageUpload}
              options={{ multiple: true, maxFiles: 5 }}
              className="inline-flex items-center justify-center px-4 py-2 underline text-black rounded hover:bg-purple-300"
              >
              Upload Images
            </CldUploadButton>
          </div>
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
                name="properties"
                value={form.properties}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Properties"
              />
              <input
                name="colour"
                value={form.colour}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Colour"
              />
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Type"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleCheckBoxChange}
                  className="h-4 w-4"
                />
                <span className="select-none">Featured</span>
              </label>
            </>
          )}

          {category === "compound" && (
            <>
            <div className="flex flex-wrap gap-2">
            {form.images.map(img => (
              <div key={img.publicId} className="relative w-24 h-24">
                <Image src={img.url} fill className="object-cover rounded" alt="" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.publicId)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4 text-sm text-center">
            <CldUploadButton
              uploadPreset="compound"
              onSuccess={handleImageUpload}
              options={{ multiple: true, maxFiles: 5 }}
              className="inline-flex items-center justify-center px-4 py-2 underline text-black rounded hover:bg-purple-300"
              >
              Upload Images
            </CldUploadButton>
          </div>
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
              <input
                name="properties"
                value={form.properties}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Properties"
              />
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Type"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                rows={3}
                />
                <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleCheckBoxChange}
                  className="h-4 w-4"
                />
                <span className="select-none">Featured</span>
              </label>
            </>
          )}
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                Add {pretty}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
