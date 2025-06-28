// src/components/admin/ResponseBtn.jsx
'use client';
import { HiCheckCircle } from 'react-icons/hi2';
import { useRouter }     from 'next/navigation';

export default function ResponseBtn({ id, status, inquiry }) {
  const router = useRouter();
  const toggle = status === 'pending' ? 'responded' : 'pending';

  async function onClick() {
    const res = await fetch(`/api/${inquiry}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: toggle }),
    });
    if (res.ok) router.refresh();
    else alert('Failed to update status');
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 text-sm ${
        status === 'responded'
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-green-600 hover:text-green-800 cursor-pointer'
      }`}
      disabled={status === 'responded'}
    >
      <HiCheckCircle />
      <span>
        {status === 'pending' ? 'Mark as Responded' : 'Responded'}
      </span>
    </button>
  );
}
