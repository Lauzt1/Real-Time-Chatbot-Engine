import EditTopicForm from '@/component/EditTopicForm';

const getTopicById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/product/polisher/${id}`, {
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

export default async function EditTopic({ params }) {
    const { id } = params;
    const { topic } = await getTopicById(id);
    const { title, description } = topic;
    return (
        <EditTopicForm id={id} title={title} description={description}/>
    )
}