"use client"
import { zAxisDefaultProps } from "recharts/types/cartesian/ZAxis"
import { Card } from "../ui/card"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ArrowRight, Book, BookOpen, Lock, Mail, QrCode, User } from "lucide-react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import Image from "next/image"
import Link from "next/link"

const loginSchema = z.object({
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว')
})

type LoginSchema = z.infer<typeof loginSchema>

const LoinForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    const onSubmit = async (data: LoginSchema) => {
        console.log(data)
    }
    return (

        <div className="flex border rounded-xl overflow-hidden shadow  max-w-3xl">

            <div className="bg-primary/80 text-white p-10 w-xs space-y-4">
                <div>
                    {/* Logo */}
                    <span className=" bg-primary-foreground inline-block rounded-2xl p-2 ">
                        <Image
                            src="/logoipsum-custom-logo.svg"
                            alt="logo"
                            width={80} height={36}
                        />
                    </span>
                    <h1 className="text-h2 mt-4">Preserve every milestone, beautifully.</h1>
                    <p className="text-body-sm text-white/70 mt-2">A dedicated editorisal space for teachers to curate and share the journey of their classroom throught vivid stroytelling and shared memoires.</p>
                </div>

                <div className="relative w-full h-30 rounded-2xl overflow-hidden">
                    <Image
                        src={'https://plus.unsplash.com/premium_vector-1744266501079-22d0c17fbfde?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt="image"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* ฝั่งขวา */}
            <div className="p-10 my-auto w-md ">
                <h2 className="text-h2 font-bold">Welcome Back</h2>
                <p className="text-body-sm text-muted-foreground mt-1">Continue your classroom's story.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                    <FieldGroup>


                        <Field>
                            <FieldLabel className="text-body-sm font-medium">Work Email</FieldLabel>
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
                                <FieldDescription className="  text-body-sm">
                                    {errors.password.message}
                                </FieldDescription>
                            )}
                        </Field>
                        <Button type="submit" disabled={isSubmitting} className="w-full font-semibold " size={'lg'}>
                            {isSubmitting ? 'Login...' : 'Login'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </FieldGroup>
                </form>
                <p className="text-xs text-center mt-4 text-muted-foreground">
                    New to MemoryLane?{' '}
                    <Link href="/register" className="text-primary font-medium hover:underline">
                        Create an account
                    </Link>
                </p>

            </div>


        </div>
    )
}
export default LoinForm