import { Mail, MapPin } from "lucide-react"
import { Card } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const eventSchema = z.object({
    eventDate: z.coerce.date().refine(d => !isNaN(d.getTime()), {
        message: "Please select a valid date"
    }),
    eventName: z.string().min(1, "Event name is required"),
    eventLocation: z.string().min(1, "Location is required"),
})

export type EventSchema = z.infer<typeof eventSchema>

interface CreateEventFormProps {
    onSubmit: (data: EventSchema) => void
}

const CreateEventForm = ({ onSubmit }: CreateEventFormProps) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            eventName: "",
            eventDate: undefined,
            eventLocation: "",
        }
    })

    const handleFormSubmit = (data: EventSchema) => {
        onSubmit(data)
        reset()

    }

    return (
        <Card className="p-4 ">
            <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">

                        <Field>
                            <FieldLabel className="text-body-sm font-medium">EVENT NAME</FieldLabel>
                            <div className="relative text-muted-foreground">
                                <Input
                                    {...register('eventName')}
                                    type="text"
                                    autoComplete="off"
                                    placeholder="e.g. Summer Solstice SOiree"
                                    className=" bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            {errors.eventName && (
                                <FieldDescription className="text-red-500 text-body-sm">
                                    {errors.eventName.message}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel className="text-body-sm font-medium">EVENT DATE</FieldLabel>
                            <div className="relative text-muted-foreground">
                                <Input
                                    {...register('eventDate')}
                                    type="date"
                                    autoComplete="off"
                                    className=" bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            {errors.eventDate && (
                                <FieldDescription className="text-red-500 text-body-sm">
                                    {errors.eventDate.message}
                                </FieldDescription>
                            )}
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel className="text-body-sm font-medium">LOCATION</FieldLabel>
                        <div className="relative text-muted-foreground">
                            <MapPin className="absolute left-3 top-3.5 h-4 w-4" />
                            <Input
                                {...register('eventLocation')}
                                type="text"
                                autoComplete="off"
                                placeholder="Search for a venue or address"
                                className="pl-10 bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        {errors.eventLocation && (
                            <FieldDescription className="text-red-500 text-body-sm">
                                {errors.eventLocation.message}
                            </FieldDescription>
                        )}
                    </Field>
                </FieldGroup>
                <div className="flex justify-between">
                    <p className="max-w-85 ">By creating this event, you agree to our Editorial Terms of Service and Privacy Policy regarding guest data.</p>
                    <Button
                        size={'lg'}
                        className="rounded-full"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Generate Souvenir Key
                    </Button>
                </div>

            </form>


        </Card >
    )
}
export default CreateEventForm