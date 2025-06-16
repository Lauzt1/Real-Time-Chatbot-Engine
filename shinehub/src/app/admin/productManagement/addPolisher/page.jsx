"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPolisher() {
    const [name, setName] = useState("");
    const [backingpad, setBackingpad] = useState("");
    const [orbit, setOrbit] = useState("");
    const [power, setPower] = useState("");
    const [rpm, setRpm] = useState("");
    const [weight, setWeight] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !backingpad || !orbit || !power || !rpm || !weight || !description || !imageUrl ) {
            alert("All fields are required.");
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/polisher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, backingpad, orbit, power, rpm, weight, description, imageUrl }),
            });

            if (res.ok) {
                router.push("/admin/productManagement");
            } else {
                throw new Error("Failed to add a product");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Add a new polisher</h2>
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Polisher Name"    
            />
            <input
                onChange={(e) => setBackingpad(e.target.value)}
                value={backingpad}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Backing Pad (inch)"    
            />
            <input
                onChange={(e) => setOrbit(e.target.value)}
                value={orbit}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Orbit (mm)"    
            />
            <input
                onChange={(e) => setPower(e.target.value)}
                value={power}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Power (W)"    
            />
            <input
                onChange={(e) => setRpm(e.target.value)}
                value={rpm}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="R.P.M."    
            />
            <input
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Weight (kg)"    
            />
            <input
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Polisher Description"    
            />
            <input
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="asd"    
            />

            <button
                type="submit"
                className="bg-purple-600 font-bold text-white py-3 px-6 w-fit"
            >
                Add Polisher
            </button>
        </form>
    )
}