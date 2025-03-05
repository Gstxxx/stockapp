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
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            await signIn(values);
            router.push("/dashboard");
            toast.success("Login realizado com sucesso.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Algo deu errado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Partículas de fundo */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => {
                    const size = ((i * 173) % 10) + 5;
                    const top = ((i * 631) % 100);
                    const left = ((i * 397) % 100);
                    const delay = ((i * 127) % 5);

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-orange-500/20"
                            style={{
                                width: size,
                                height: size,
                                top: `${top}%`,
                                left: `${left}%`
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 8,
                                delay: delay,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    );
                })}
            </div>

            {/* Efeito de luz seguindo o cursor */}
            <div
                className="absolute bg-orange-500/10 blur-[100px] rounded-full w-[300px] h-[300px] pointer-events-none"
                style={{
                    left: mousePosition.x - 150,
                    top: mousePosition.y - 150,
                    transition: "transform 0.2s ease-out",
                }}
            />

            <motion.div
                className="w-full max-w-md space-y-8 rounded-2xl backdrop-blur-xl bg-white/10 p-8 shadow-2xl border border-white/10 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Bem-vindo
                    </h2>
                    <p className="text-orange-300/80">Faça login para continuar</p>
                </motion.div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-orange-200 font-medium">Nome de usuário</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Input
                                                    placeholder="Digite seu usuário"
                                                    {...field}
                                                    className="bg-white/5 text-white border-0 rounded-lg py-6 px-4 placeholder:text-white/30 
                                                    focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-0
                                                    transition-all duration-300 group-hover:bg-white/10"
                                                />
                                                <div className="absolute inset-y-0 right-4 flex items-center text-orange-300/50 group-hover:text-orange-300/80 transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-orange-200/80" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-orange-200 font-medium">Senha</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Input
                                                    type="password"
                                                    placeholder="Digite sua senha"
                                                    {...field}
                                                    className="bg-white/5 text-white border-0 rounded-lg py-6 px-4 placeholder:text-white/30 
                                                    focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-0
                                                    transition-all duration-300 group-hover:bg-white/10"
                                                />
                                                <div className="absolute inset-y-0 right-4 flex items-center text-orange-300/50 group-hover:text-orange-300/80 transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-orange-200/80" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="pt-2"
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 
                                text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-orange-500/20 
                                transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 
                                focus:ring-4 focus:ring-orange-500/30 focus:outline-none relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <span className="relative z-10">Entrar</span>
                                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></span>
                                    </>
                                )}
                            </Button>

                            <div className="mt-4 text-center">
                                <a href="#" className="text-orange-300/80 hover:text-orange-300 text-sm transition-colors">
                                    Esqueceu sua senha?
                                </a>
                            </div>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}