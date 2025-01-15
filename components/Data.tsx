"use client";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";

const Data = () => {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from("products").select("*");
      console.log(data);
      if (error) console.error("Error al obtener datos:", error.message);
      else setData(data || []);
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>Datos</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Data;
