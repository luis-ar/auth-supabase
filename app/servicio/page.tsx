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
  title: z
    .string()
    .nonempty({
      message: "Title is required",
    })
    .min(2, {
      message: "Title must be at least 2 characters long",
    })
    .max(50, {
      message: "Title cannot exceed 50 characters",
    }),

  description: z
    .string()
    .nonempty({
      message: "Description is required",
    })
    .min(2, {
      message: "Description must be at least 2 characters long",
    })
    .max(50, {
      message: "Description cannot exceed 50 characters",
    }),
  photo: z
    .any()
    .refine((file: File | null) => file && file.size > 0, {
      message: "Photo is required",
    })
    .refine(
      (file: File | null) =>
        file && ["image/jpeg", "image/png"].includes(file.type),
      { message: "Only JPEG or PNG files are allowed" }
    )
    .refine(
      (file: File | null) => file && file.size <= 5 * 1024 * 1024, // Máximo 5 MB
      { message: "Photo must be smaller than 5MB" }
    ),
});

const PageService = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      photo: null,
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    const { title, description, photo } = values;
    const { data, error } = await supabase.storage.listBuckets();
    const bucketExists = data?.some((bucket) => bucket.name === "avatars");
    if (!bucketExists) {
      await supabase.storage.createBucket("avatars", {
        public: true,
      });
    }
    const namePhoto = `${
      process.env.NEXT_PUBLIC_SUPABASE_URL
    }/storage/v1/object/public/avatar_${Date.now()}.png`;
    const { data: dataServices, error: errorServices } = await supabase
      .from("services")
      .insert([{ name: title, description: description, photo: namePhoto }])
      .select();
    await supabase.storage.from("avatars").upload(namePhoto, photo);
    if (
      errorServices?.message?.includes(
        'duplicate key value violates unique constraint "services_name_key"'
      )
    ) {
      console.log("Duplicado");
    } else {
      console.log("Otro error:", errorServices?.message);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0]; // Captura el archivo seleccionado
                    field.onChange(file); // Pasa el archivo al estado del formulario
                  }}
                />
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

export default PageService;
