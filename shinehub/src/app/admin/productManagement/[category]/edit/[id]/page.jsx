// src/app/admin/productManagement/[category]/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CategorySidebar from "@/components/admin/CategorySidebar";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

export default function EditItemPage() {
  const router = useRouter();
  const { category, id } = useParams();

  const pretty = {
      polisher: "Polisher",
      pad:      "Pad",
      compound: "Compound",
    }[category] || "Item";

  // Initial empty shape
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
  const [loading, setLoading] = useState(true);

  // load existing item
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/${category}/${id}`);
        if (!res.ok) throw new Error("Load failed");
        const data = await res.json();
        const item = data[category] || data;
        setForm({
          ...getInitial(category),
          ...item,
          featured: Boolean(item.featured),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load item");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, id]);

     // handle a boolean checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // handle new image uploads (append)
  const handleImageUpload = (result) => {
    const info = result.info;
    if (info.secure_url && info.public_id) {
      setForm((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          { url: info.secure_url, publicId: info.public_id },
        ],
      }));
    }
  };
  
  // remove a single image
  const handleRemoveImage = async (publicIdToRemove) => {
    try {
      await fetch("/api/removeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: publicIdToRemove }),
      });
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.publicId !== publicIdToRemove),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to remove image");
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in form) {
      if (key !== "images" && form[key] === "") {
        alert("All fields are required.");
        return;
      }
    }

    let body = { ...form };
    if (category === "polisher") {
      body = {
        ...body,
        backingpad: parseFloat(body.backingpad),
        orbit: parseFloat(body.orbit),
        power: parseFloat(body.power),
        weight: parseFloat(body.weight),
      };
    } else {
      body.size = parseFloat(body.size);
    }

    const res = await fetch(`/api/${category}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`${pretty} updated successfully.`);
      router.push(`/admin/productManagement/${category}`);
    } else {
      console.error(await res.text());
      alert("Failed to update.");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="flex">
      <CategorySidebar active={category} />

      <main className="flex-1 p-6">
        <div className="flex flex-col items-center bg-purple-50 rounded-lg p-6 mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold mb-4 text-purple-600">
            Edit {pretty}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-4 w-full text-left"
          >
            {category === "polisher" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img) => (
                    <div key={img.publicId} className="relative w-24 h-24">
                      <Image
                        src={img.url}
                        fill
                        className="object-cover rounded"
                        alt=""
                      />
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
                  placeholder="Name"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  name="backingpad"
                  value={form.backingpad}
                  onChange={handleChange}
                  type="number"
                  placeholder="Backing Pad (inch)"
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
                  placeholder="Description"
                  rows={5}
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured
                  </label>
                </div>
              </>
            )}

            {category === "pad" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img) => (
                    <div key={img.publicId} className="relative w-24 h-24">
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover rounded"
                      />
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
                  placeholder="Colour"
                  className="w-full border px-3 py-2 rounded"
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
                  placeholder="Description"
                  rows={5}
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured
                  </label>
                </div>
              </>
            )}

            {category === "compound" && (
              <>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img) => (
                    <div key={img.publicId} className="relative w-24 h-24">
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover rounded"
                      />
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
                  placeholder="Description"
                  rows={5}
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured
                  </label>
                </div>
              </>
            )}
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
