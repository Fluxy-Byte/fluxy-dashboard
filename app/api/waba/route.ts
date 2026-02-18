import { NextResponse } from "next/server";
import { coletarTodosWabas } from "@/lib/waba"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationid")
    console.log(organizationId)
    if (!organizationId) {
        return NextResponse.json(
            { error: "organizationId é obrigatório" },
            { status: 400 }
        )
    }

    const organizations = await coletarTodosWabas(organizationId);

    return NextResponse.json(organizations, { status: organizations.status == true ? 200 : 500 })
}


// http://localhost:3000/api/waba?organizationid=1
