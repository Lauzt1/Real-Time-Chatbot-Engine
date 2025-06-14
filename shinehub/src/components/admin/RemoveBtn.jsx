"use client";

import { HiTrash } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function RemoveBtn ({ id }) {
    const router = useRouter();
    const removeMessage = async () => {
        const confirmed = confirm("Are you sure?");
        if (confirmed) {
            const res = await fetch(`http://localhost:3000/api/message?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            }       
        }
    };
    return (
        <button onClick={removeMessage} className="text-red-400">
            <HiTrash size={23} />
        </button>
    )
}
