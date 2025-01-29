import { supabase } from "@/lib/supabaseClient";

async function obtenerUsuarios() {
  const dataUser: any[] = [];
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error al obtener usuarios:", error);
  } else {
    data.users.forEach((user) => {
      dataUser.push({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        label: "documentation",
        role: user.user_metadata.role,
      });
    });
  }
  return dataUser;
}

export default obtenerUsuarios;
