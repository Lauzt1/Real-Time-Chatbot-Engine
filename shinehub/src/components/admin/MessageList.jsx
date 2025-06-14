import RemoveBtn from './RemoveBtn';

const getMessage = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/message", {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch messages");
        }
        return res.json();
        } catch (error) {
            console.log("Error loading messages: ", error);
        }
    };

export default async function MessageList() {
    const { message } = await getMessage();
    return (
        <>
            {message.map((t) => (
                <div
                    key={t._id} 
                    className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div>
                        <h2 className="font-bold text-2xl">{t.name}</h2>
                        <div>{t.email}</div>
                        <div>{t.phoneNumber}</div>
                        <div>{t.companyName}</div>
                        <div className="mt-2">{t.message}</div>
                    </div>

                    <div className="flex gap-2">
                        <RemoveBtn id={t._id} />
                    </div>
                </div>
            ))}
        </>
    )
};