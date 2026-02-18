"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getWabas } from "@/app/services/waba";
import type { WabaWithContacts, Contacts } from "@/lib/waba.interface";
import { User } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const [idOrganization, setIdOrganization] = useState<string | null>(null);
  const [wabas, setWabas] = useState<WabaWithContacts[]>([]);
  const [agente, setAgente] = useState<WabaWithContacts | null>(null);
  const [contact, setContact] = useState<Contacts | null>(null);

  useEffect(() => {
    if (idOrganization) {
      coletarWabasDaOrganizacao(idOrganization)
    }
  }, [idOrganization])

  async function coletarWabasDaOrganizacao(id: string) {
    try {
      const result = await getWabas(id);
      console.log(result)
      setWabas(result.wabas);
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    console.log(agente)
  }, [agente])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {session?.user?.name}
        </p>
      </div>

      <div className="w-full h-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nenhuma campanha criada ainda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nenhuma campanha ativa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pessoas alcançadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Taxa média</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>
            Historicos de conversas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-4">
          <Select onValueChange={(v) => setIdOrganization(v)}>
            <SelectTrigger className="w-full max-w-70">
              <SelectValue placeholder="Selecione uma organização" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Organizações</SelectLabel>
                {organizations && organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const selected = wabas.find((a) => a.id === value)
              setAgente(selected ?? null)
            }}
          >
            <SelectTrigger className="w-full max-w-70">
              <SelectValue placeholder="Selecione um Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Agentes</SelectLabel>
                {wabas.length > 0 && wabas.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.displayPhoneNumber} - {a.agent.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p>Contatos encontrados:</p>
          <div className="flex gap-6">
            {agente && agente.contacts.map((c) => (
              <Item key={c.id} onClick={() => setContact(c)} className="border-neutral-200 max-w-md shadow-md">
                <div className="flex gap-4">
                  <ItemMedia variant="icon">
                    <User />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{c.name ?? "Nome não coletado"}</ItemTitle>
                    <ItemDescription>
                      {c.phone} - {c.leadGoal ?? "Sem dados do lead"}
                    </ItemDescription>
                  </ItemContent>
                </div>
                <Drawer direction="right">
                  <DrawerTrigger asChild>
                    <Button variant="outline">Ver conversa</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Move Goal</DrawerTitle>
                      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="no-scrollbar overflow-y-auto px-4">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <p
                          key={index}
                          className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal"
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                          enim ad minim veniam, quis nostrud exercitation ullamco laboris
                          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu fugiat
                          nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                          sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                      ))}
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Fechar</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Item>

            )
            )}
          </div>



        </CardContent>
      </Card>
    </div>
  )
}
