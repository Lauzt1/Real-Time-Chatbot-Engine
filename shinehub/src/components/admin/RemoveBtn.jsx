"use client";

import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function RemoveBtn({ id, resource }) {
  // resource should be the lowercase slug: "polisher", "pad", or "compound"
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await fetch(`/api/${resource}/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // refresh the current page’s data
      router.refresh();
    } else {
      console.error("Delete failed:", await res.text());
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-400">
      <HiTrash size={23} />
    </button>
  );
}
