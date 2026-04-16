"use client"
import { useState } from "react"
import CreateEventForm, { EventSchema } from "./CreateEventForm"
import EventSuccessBanner from "./EventSuccessBanner"
import { nanoid } from 'nanoid'

const CreateEventSection = () => {
    const [step, setStep] = useState<1 | 2>(1)
    const [eventResult, setEventResult] = useState<{ shareableUrl: string } | null>(null)

    const handleSubmit = (data: EventSchema) => {

        const key = nanoid(10)
        setEventResult({ shareableUrl: `localhost:3000/event/${key}` })
        setStep(2)
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