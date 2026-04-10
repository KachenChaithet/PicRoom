"use client"
import { ArrowRight, BookOpen, Lock, Mail, QrCode, User } from "lucide-react"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "../ui/button"
import Link from "next/link"

const registerSchema = z.object({
    username: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัว'),
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว')
})

type RegisterSchema = z.infer<typeof registerSchema>
const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })


    const onSubmit = async (data: RegisterSchema) => {
        console.log(data)
    }
    return (

            <div className="flex border rounded-xl overflow-hidden shadow max-w-3xl">

                <div className="bg-primary/80 text-white p-10 w-xs space-y-4">
                    <div>
                        <Badge className="uppercase text-body-sm">start your journey</Badge>
                        <h1 className="text-h2 mt-4">Capture the magic of your classroom.</h1>
                        <p className="text-body-sm text-white/70 mt-2">Create a digital scrapbooks that parents will cherish forever. Join thousands of educators making memories together.</p>
                    </div>
                    <div className="flex flex-col gap-4 ">

                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 rounded-lg p-2 shrink-0">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-body-base font-semibold">Curated Galleries</h3>
                                <p className="text-body-sm text-white/70">Organize photos by semester, event, or student.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-white/20 rounded-lg p-2 shrink-0">
                                <QrCode className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-body-base font-semibold">Quick Connect</h3>
                                <p className="text-body-sm text-white/70">Invite parents with instant QR code access.</p>
                            </div>
                        </div>

                    </div>
                    <div className="relative w-full h-30 rounded-2xl overflow-hidden">
                        <Image
                            src={'https://plus.unsplash.com/premium_vector-1723080782510-a1fa4dd6854a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                            alt="image"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* ฝั่งขวา */}
                <div className="p-10 my-auto w-md">
                    <h2 className="text-h2 font-bold">Create Teacher Account</h2>
                    <p className="text-body-sm text-muted-foreground mt-1">Sign up to start documenting your class achievements.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="text-body-sm font-medium">Full Name</FieldLabel>
                                <div className="relative text-muted-foreground">
                                    <User className="absolute left-3 top-3.5 h-4 w-4" />
                                    <Input
                                        {...register('username')}
                                        type="text"
                                        autoComplete="username"
                                        placeholder="username..."
                                        className="pl-10 bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                {errors.username && (
                                    <FieldDescription className="text-red-500 text-body-sm">
                                        {errors.username.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel className="text-body-sm font-medium">Email</FieldLabel>
                                <div className="relative text-muted-foreground">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4" />
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        autoComplete="email"
                                        placeholder="teacher@email.com"
                                        className="pl-10 bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                {errors.email && (
                                    <FieldDescription className="text-red-500 text-body-sm">
                                        {errors.email.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel className="text-body-sm font-medium text-gray-600 ">Password</FieldLabel>
                                <div className="relative text-muted-foreground">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4" />
                                    <Input
                                        {...register('password')}
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-primary/10 h-10 text-body-sm text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                {errors.password && (
                                    <FieldDescription className="text-red-500 text-body-sm">
                                        {errors.password.message}
                                    </FieldDescription>
                                )}
                            </Field>
                            <Button type="submit" disabled={isSubmitting} className="w-full font-semibold " size={'lg'}>
                                {isSubmitting ? 'Register...' : 'Register'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </FieldGroup>
                    </form>
                    <p className="text-xs text-center mt-4">Already have an account?{' '}<Link href={'/login'} className="text-primary underline">Sign in here</Link></p>

                </div>


            </div>
    )
}
export default RegisterForm