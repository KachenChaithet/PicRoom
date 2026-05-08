import LoginForm from "@/components/auth/LoinForm"
import { supabase } from "@/lib/supabase"

const page = async () => {
    const { data } = await supabase.auth.getSession()
    console.log(data)
    return (
        <div>
            <LoginForm />
        </div>
    )
}
export default page