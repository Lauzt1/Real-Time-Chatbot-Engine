"use client";
import { useState} from "react";
import { useRouter } from "next/navigation";

export default function EditPolisherForm ({ id, name, backingpad, orbit, power, rpm, weight, description, imageUrl }) {

    const [newName, setNewName] = useState(name);
    const [newBackingpad, setNewBackingpad] = useState(backingpad);
    const [newOrbit, setNewOrbit] = useState(orbit);
    const [newPower, setNewPower] = useState(power);
    const [newRpm, setNewRpm] = useState(rpm);
    const [newWeight, setNewWeight] = useState(weight);
    const [newDescription, setNewDescription] = useState(description);
    const [newImageUrl, setNewImageUrl] = useState(imageUrl);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3000/api/polisher/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName, newBackingpad, newOrbit, newPower, newRpm, newWeight, newDescription, newImageUrl }),
            })

            if (!res.ok) {
                throw new Error("Failed to update topic");
            }

            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);
        };
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Polisher Name"    
            />
            <input
                onChange={(e) => setNewBackingpad(e.target.value)}
                value={newBackingpad}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Backing Pad (inch)"    
            />
            <input
                onChange={(e) => setNewOrbit(e.target.value)}
                value={newOrbit}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Orbit (mm)"    
            />
            <input
                onChange={(e) => setNewPower(e.target.value)}
                value={newPower}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Power (W)"    
            />
            <input
                onChange={(e) => setNewRpm(e.target.value)}
                value={newRpm}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="R.P.M."    
            />
            <input
                onChange={(e) => setNewWeight(e.target.value)}
                value={newWeight}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Weight (kg)"    
            />
            <input
                onChange={(e) => setNewDescription(e.target.value)}
                value={newDescription}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Polisher Description"    
            />
            <input
                onChange={(e) => setNewImageUrl(e.target.value)}
                value={newImageUrl}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="asd"    
            />
            <button className="bg-green-600 font-bold text-white py-3 px-6 w-fit">
                Update Polisher
            </button>
        </form>
    )
}