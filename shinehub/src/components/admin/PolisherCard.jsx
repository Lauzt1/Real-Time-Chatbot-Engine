import RemoveBtn from './RemoveBtn';

const getPolisher = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/polisher", {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch polisher");
        }
        return res.json();
        } catch (error) {
            console.log("Error loading polisher: ", error);
        }
    };

export default async function ProductCard() {
    const { polisher } = await getPolisher();
    return (
        <>
            {polisher.map((t) => (
                <div
                    key={t._id} 
                    className="block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <div className="p-4 text-center">
                        <h2 className="font-medium">{t.name}</h2>
                        {/* <div>{t.backingpad}</div>
                        <div>{t.orbit}</div>
                        <div>{t.power}</div>
                        <div>{t.rpm}</div>
                        <div>{t.weight}</div>
                        <div>{t.description}</div>
                        <div>{t.imageUrl}</div> */}
                    </div>

                    <div className="flex gap-2">
                        <RemoveBtn id={t._id} />
                    </div>
                </div>
            ))}
        </>
    )
};