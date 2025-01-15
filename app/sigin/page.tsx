"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({
      message: "Invalid email format",
    })
    .min(2, {
      message: "Email must be at least 2 characters long",
    })
    .max(50, {
      message: "Email cannot exceed 50 characters",
    }),
});

const PageLogin = () => {
  const router = useRouter(); // Hook de Next.js para manejar la navegación

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    const { email } = values;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/home`, // Redirigir a /home después de la confirmación
      },
    });

    console.log("dentro");

    if (error) {
      console.log(error.message);
    } else {
      console.log("Se ha enviado un enlace mágico a tu correo electrónico.");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PageLogin;
