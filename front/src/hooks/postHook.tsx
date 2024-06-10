import axios, { AxiosRequestConfig, Method } from 'axios'
import { useRouter } from 'next/navigation'
import { userAuthStore } from '@/store/userAuthStore'

interface AuthFetchProps {
    endpoint: string
    redirectRoute?: string
    formData?: any
    options?: AxiosRequestConfig<any>
    method?: Method
}

export function useFetch() {
    const router = useRouter();
    const setUser = userAuthStore((state) => state.setUser);
    const setCelebrity = userAuthStore((state) => state.setCelebrity);
    const setToken = userAuthStore((state) => state.setToken);

    const authRouter = async ({
        endpoint,
        formData,
        redirectRoute,
        options,
        method = 'post' // default method is post
    }: AuthFetchProps) => {
        try {
            const { data } = await axios({
                url: `http://localhost:3001/api/${endpoint}`,
                method,
                data: formData,
                ...options
            })
            console.log(data);
            //hacer logica del redirect

            setToken(data.token);
            setUser(data.user);
            setCelebrity(data.celebrity);

            if (redirectRoute) {
                router.push(redirectRoute)
                router.refresh();
            }
            return data
        } catch (error: any) {
            console.log("error");
        }
    }

    return authRouter
}