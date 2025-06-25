"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CategorySidebar from "@/components/admin/CategorySidebar";
import { CldUploadButton,  } from 'next-cloudinary';
import { HiOutlinePhotograph, HiOutlineTrash } from "react-icons/hi";
import Image from "next/image";

export default function AddItemPage() {
  const { category } = useParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");

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
          imageUrl: "",
        };
      case "compound":
        return {
          name: "",
          code: "",
          size: "",
          description: "",
          imageUrl: "",
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

  const handleImageUpload = (result) => {
    const info = result.info;

    if ('secure_url' in info && 'public_id' in info) {
      const url = info.secure_url;
      const publicId = info.public_id;
      setImageUrl(url);
      setPublicId(publicId);
      setForm((prev) => ({
        ...prev,
        imageUrl: info.secure_url,
      }));
    }
  };

    const removeImage = async (e) => {
      e.preventDefault();
  
      const res = await fetch('/api/removeImage', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
  
      if (res.ok) {
        setImageUrl("");
        setPublicId("");
      }
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
            <div className="space-y-2">
              <label className="block font-medium">Upload Image</label>
              <CldUploadButton
                uploadPreset="polisher"
                className={`h-36 w-full border grid place-items-center bg-slate-100 rounded-md relative ${imageUrl && "pointer-events-none"}`}
                name="imageUrl"
                onSuccess={handleImageUpload}
              >
                <HiOutlinePhotograph />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    fill
                    className="adsolute object-cover inset-0"
                    alt={form.name}
                  />
                )}
              </CldUploadButton>
                {publicId && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-2 py-2 px-4 rounded bg-red-600 text-white"
                  >
                    <HiOutlineTrash />
                    Remove Image
                  </button>
              )}
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

          {/* Pad fields */}
          {category === "pad" && (
            <>
            <div className="space-y-2">
              <label className="block font-medium">Upload Image</label>
              <CldUploadButton
                uploadPreset="polishingpad"
                className={`h-36 w-full border grid place-items-center bg-slate-100 rounded-md relative ${imageUrl && "pointer-events-none"}`}
                name="imageUrl"
                onSuccess={handleImageUpload}
              >
                <HiOutlinePhotograph />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    fill
                    className="adsolute object-cover inset-0"
                    alt={form.name}
                  />
                )}
              </CldUploadButton>
                {publicId && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-2 py-2 px-4 rounded bg-red-600 text-white"
                  >
                    <HiOutlineTrash />
                    Remove Image
                  </button>
              )}
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
            <div className="space-y-2">
              <label className="block font-medium">Upload Image</label>
              <CldUploadButton
                uploadPreset="compound"
                className={`h-36 w-full border grid place-items-center bg-slate-100 rounded-md relative ${imageUrl && "pointer-events-none"}`}
                name="imageUrl"
                onSuccess={handleImageUpload}
              >
                <HiOutlinePhotograph />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    fill
                    className="adsolute object-cover inset-0"
                    alt={form.name}
                  />
                )}
              </CldUploadButton>
                {publicId && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center gap-2 py-2 px-4 rounded bg-red-600 text-white"
                  >
                    <HiOutlineTrash />
                    Remove Image
                  </button>
              )}
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
