import { prisma } from "@/lib/prisma";

export async function coletarTodosWabas(organizationId: string) {
    try {

        const wabas = await prisma.waba.findMany({
            where: {
                organizationId
            },
            include: {
                contacts: true,
                agent: true
            },
        })

        if (!wabas) {
            return {
                status: false,
                wabas: [],
                message: "Wabas não encontrado"
            }
        }

        console.log(wabas)

        return {
            status: true,
            wabas,
            message: "Wabas encontradas"
        }

    }
    catch (e: any) {
        console.error(e)
        return {
            status: false,
            wabas: [],
            message: "Erro inesperado na consulta de wabas"
        }
    }
}