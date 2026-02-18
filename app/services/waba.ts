import axios from "axios"
import type { WabaWithContacts } from "@/lib/waba.interface";

interface Result {
    status: boolean,
    wabas: WabaWithContacts[]
    message: string
}

export async function getWabas(id: string): Promise<Result> {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

        const { data } = await axios.get(
            `${url}/api/waba?organizationid=${id}`
        )

        return data;
    } catch (e: any) {
        console.error(e);
        return {
            status: false,
            wabas: [],
            message: "Erro inesperado na consulta de wabas"
        }
    }
}