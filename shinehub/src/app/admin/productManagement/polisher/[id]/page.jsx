import EditPolisherForm from '@/components/admin/EditPolisherForm';

const getPolisherById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/polisher/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch polisher");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function EditPolisher({ params }) {
    const { id } = params;
    const { polisher } = await getPolisherById(id);
    const { name, backingpad, orbit, power, rpm, weight, description, imageUrl } = polisher;
    return (
        <EditPolisherForm
            id={id}
            name={name}
            backingpad={backingpad}
            orbit={orbit}
            power={power}
            rpm={rpm}
            weight={weight}
            description={description}
            imageUrl={imageUrl}
        />
    )
}