import { Mail, MapPin } from "lucide-react"
import { Card } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const CreateEventForm = () => {
    return (
        <Card className="p-4 ">
            <form className="space-y-4">
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">

                        <Field>
                            <FieldLabel className="text-body-sm font-medium">EVENT NAME</FieldLabel>
                            <div className="relative text-muted-foreground">
                                <Input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="e.g. Summer Solstice SOiree"
                                    className=" bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <FieldDescription className="text-red-500 text-body-sm">
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel className="text-body-sm font-medium">EVENT DATE</FieldLabel>
                            <div className="relative text-muted-foreground">
                                <Input
                                    type="date"
                                    autoComplete="email"
                                    placeholder="teacher@email.com"
                                    className=" bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <FieldDescription className="text-red-500 text-body-sm">
                            </FieldDescription>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel className="text-body-sm font-medium">LOCATION</FieldLabel>
                        <div className="relative text-muted-foreground">
                            <MapPin className="absolute left-3 top-3.5 h-4 w-4" />
                            <Input
                                type="email"
                                autoComplete="email"
                                placeholder="Search for a venue or address"
                                className="pl-10 bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        <FieldDescription className="text-red-500 text-body-sm">
                        </FieldDescription>
                    </Field>
                </FieldGroup>
                <div className="flex justify-between">
                    <p className="w-85">By creating this event, you agree to our Editorial Terms of Service and Privacy Policy regarding guest data.</p>
                    <Button
                        size={'lg'}
                        className="rounded-full"
                    >
                        Generate Souvenir Key
                    </Button>
                </div>

            </form>



        </Card >
    )
}
export default CreateEventForm