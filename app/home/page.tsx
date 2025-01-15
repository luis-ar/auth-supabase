"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Welcome = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        const name = data.user.user_metadata?.name || "Usuario";
        setUserName(name);
      }

      if (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Error al cerrar sesión:", error.message);
    } else {
      console.log("Sesión cerrada con éxito");
      router.push("/"); // Redirigir al inicio
    }
  };
  return (
    <div>
      <h1>¡Bienvenido{userName ? `, ${userName}` : ""}!</h1>
      <p>Tu cuenta ha sido registrada con éxito.</p>

      <Button onClick={handleSignOut}>Cerrar sesión</Button>
    </div>
  );
};

export default Welcome;
