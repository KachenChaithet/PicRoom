"use client"
import { useState } from "react"
import CreateEventForm, { EventSchema } from "./CreateEventForm"
import EventSuccessBanner from "./EventSuccessBanner"
import { nanoid } from 'nanoid'
import axios from "axios"

const CreateEventSection = () => {
    const [step, setStep] = useState<1 | 2>(1)
    const [eventResult, setEventResult] = useState<{ shareableUrl: string } | null>(null)

    const handleSubmit = async (data: EventSchema) => {
        const formData = new FormData()
        formData.append("name", data.eventName)
        formData.append("date", data.eventDate.toISOString())
        formData.append("location", data.eventLocation)
        if (data.backgroundImage) {
            formData.append("background", data.backgroundImage)
        }


        try {
            const res = await axios.post("http://localhost:8000/rooms", formData)
            console.log(res.data);
            const key = res.data.slug

            setEventResult({ shareableUrl: `localhost:3000/event/${key}` })
            setStep(2)

        } catch (error) {
            console.log(error);
            alert(error)

        } finally {
            alert("create event successfully")
        }


    }
    return (
        <div className="mt-4 space-y-4">
            <h1 className="text-h2 text-primary">Create New Event</h1>
            <CreateEventForm
                onSubmit={handleSubmit}
            />
            {step === 2 && eventResult && <EventSuccessBanner data={eventResult} />}

        </div>
    )
}
export default CreateEventSection