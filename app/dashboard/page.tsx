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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia
} from "@/components/ui/alert-dialog"

import { Lightbulb } from "lucide-react"

import { getWabas } from "@/app/services/waba";
import type { Waba, Contact, Agent } from "@/lib/database.interface";

import { User } from "lucide-react";
import { toast } from "sonner";

import type { Result, Message } from "@/app/services/message";
import { getMessage } from "@/app/services/message";

import { getContacts } from "@/app/services/contacts";


export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const [idOrganization, setIdOrganization] = useState<string | null>(null);
  const [wabas, setWabas] = useState<Waba[]>([]);
  const [waba, setWaba] = useState<Waba | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [count, setCount] = useState<number>(0);

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
      toast.error("Tivemos um erro na busca dos agentes e dos waba dessa organização!")
    }
  }

  useEffect(() => {
    if (waba && waba.id) {
      async function coletarContatos(waba: Waba) {
        try {
          const result = await getContacts(String(waba.id));
          console.log(result.contatos)
          setContacts(result.contatos);
        } catch (e: any) {
          console.log(e)
          toast.error("Desculpe mais tivemos um erro durante a coleta dos contatos do waba: " + waba.displayPhoneNumber);
        }
      }
      coletarContatos(waba)
    }
  }, [waba])

  async function coletarMensages(userId: string, agenteId: string) {
    try {
      const result: Result = await getMessage(userId, agenteId);
      setMessages(result.historico);

      if (result.status == false) {
        toast.error(result.message)
      }

    } catch (e: any) {
      console.error(e);
      toast.error("Tivemos um erro na busca das mensagens desse contato!")
    }
  }

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
              const selected = wabas.find((a) => String(a.id) === value);
              setWaba(selected ?? null)
            }}
          >
            <SelectTrigger className="w-full max-w-70">
              <SelectValue placeholder="Selecione um Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Agentes</SelectLabel>
                {wabas.length > 0 && wabas.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.displayPhoneNumber} - {a.agent?.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p>Contatos encontrados:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contacts.length > 0 && waba && contacts.map((c) => (
              <Item key={String(c.id)} onClick={() => setContact(c)} className="border-neutral-200 max-w-md shadow-md">
                <div className="flex gap-4">
                  <ItemContent>
                    <ItemTitle className="flex justify-start items-center"><User size={"20"} className="border-black/50 shadow-sm border rounded" />{c.name ?? "Nome não coletado"}</ItemTitle>
                    <ItemDescription className="flex flex-col">
                      <span >{c.phone}</span>
                      <span>{c.email ?? "E-mail não coletado"}</span>
                    </ItemDescription>
                  </ItemContent>
                </div>

                <div className="w-full flex justify-start items-center gap-2">
                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <Button variant="outline" onClick={() => coletarMensages(String(c.id), String(waba.agent?.id))}>Ver conversa</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>{contact?.name ?? "Não indentificado"}</DrawerTitle>
                        <DrawerDescription>{contact?.phone}</DrawerDescription>
                      </DrawerHeader>
                      <div className="no-scrollbar overflow-y-auto px-4">
                        {messages.length > 0 && messages.map((m, i) => (
                          <div key={i} className="flex flex-col">
                            <div className="flex items-center justify-end py-2">
                              <span className="text-end px-2 py-1 rounded-md bg-green-800 text-white">{m.question_message}</span>
                            </div>
                            <div className="flex items-center justify-start">
                              <span className="text-start px-2 py-1 rounded-md bg-neutral-700 text-white">{m.answer_message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Fechar</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  {c.leadGoal && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-10" variant={"outline"}><Lightbulb /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader className="flex justify-start">
                          <AlertDialogMedia>
                            <Lightbulb />
                          </AlertDialogMedia>
                          <div className="flex justify-start flex-col">
                            <AlertDialogTitle>Objetivo do lead</AlertDialogTitle>
                            <AlertDialogDescription>
                              {c.leadGoal}
                            </AlertDialogDescription>
                          </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Fechar</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

              </Item>
            )
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
