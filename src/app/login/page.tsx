"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/signIn";

const formSchema = z.object({
    username: z.string().min(4, {
        message: "Por favor, insira um nome de usuário válido.",
    }),
    password: z.string().min(4, {
        message: "A senha deve ter pelo menos 4 caracteres.",
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await signIn(values);
            router.push("/dashboard");
            toast.success("Login realizado com sucesso.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Algo deu errado");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#165fa3]">
                        Bem-vindo de volta
                    </h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#165fa3]">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jão" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#165fa3]">Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-[#165fa3] hover:bg-[#1e74c4]"
                        >
                            Entrar
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}