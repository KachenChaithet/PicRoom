import CreateEventForm from "./CreateEventForm"

const CreateEventSection = () => {
    return (
        <div className="mt-4 space-y-4">
            <h1 className="text-h2 text-primary">Create New Event</h1>
            <CreateEventForm 
            />
        </div>
    )
}
export default CreateEventSection