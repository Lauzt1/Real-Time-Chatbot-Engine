"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";

export default function ContactForm () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phoneNumber || !companyName || !message) {
            alert("All fields are required.");
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phoneNumber, companyName, message }),
            });

            if (res.ok) {
                window.alert("The message has been sent successfully.");
                setName("");
                setEmail("");
                setPhoneNumber("");
                setCompanyName("");
                setMessage("");
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Drop us a message</h2>
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Name"
                required
            />
            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Email Address"
                required
            />
            <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Phone Number"
                required
            />
            <input
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
                className="w-full border px-3 py-2 rounded text-black"
                type="text"
                placeholder="Company Name"
                required
            />
            <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="w-full border px-3 py-2 rounded text-black"
                placeholder="Your Message"
                rows="3"
                required
            />
            <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Send Message
            </button>
        </form>
    )
}