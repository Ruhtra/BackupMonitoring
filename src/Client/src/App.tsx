"use client";

import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Database,
  LucideIcon,
  Upload,
  HardDrive,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RegGetAllOutputDto } from "../../Application/RegUseCase/RegGetAll/RegGetAllDto";
import { useGetSeparacao } from "./Services/Querys/Reg/GetAll";

interface Backup {
  id: string;
  dbName: string;
  statusBackup: string;
  statusSend: string;
  createdAt: string;
}

interface StatusInfo {
  icon: LucideIcon;
  color: string;
  ptBR: string;
  ptBRShort: string;
}

export function App() {
  const { data: backupsData = [] } = useGetSeparacao(true);

  const backups: Backup[] = backupsData.map((item: RegGetAllOutputDto) => ({
    ...item,
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : item.createdAt,
  }));

  const groupedBackups = backups.reduce((acc, backup) => {
    const date = format(parseISO(backup.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(backup);
    return acc;
  }, {} as Record<string, Backup[]>);

  const getStatusInfo = (status: string): StatusInfo => {
    switch (status) {
      case "progress":
        return {
          icon: RefreshCw,
          color: "bg-blue-100 text-blue-800",
          ptBR: "Em Progresso",
          ptBRShort: "Progresso",
        };
      case "success":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
          ptBR: "Sucesso",
          ptBRShort: "Sucesso",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "bg-red-100 text-red-800",
          ptBR: "Erro",
          ptBRShort: "Erro",
        };
      case "idle":
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800",
          ptBR: "Inativo",
          ptBRShort: "Inativo",
        };
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800",
          ptBR: "Desconhecido",
          ptBRShort: "Desc.",
        };
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Monitoramento de Backup
        </h1>
        <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groupedBackups).map(([date, dailyBackups]) => (
            <Card key={date} className="overflow-hidden shadow-lg bg-white">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl text-gray-700">
                  {format(parseISO(date), "d 'de' MMMM, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-gray-200">
                    {dailyBackups.map((backup) => (
                      <div
                        key={backup.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Database className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {backup.dbName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {format(parseISO(backup.createdAt), "HH:mm:ss")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              {
                                type: "statusBackup",
                                label: "Backup",
                                icon: HardDrive,
                              },
                              {
                                type: "statusSend",
                                label: "Envio",
                                icon: Upload,
                              },
                            ] as const
                          ).map(({ type, label, icon: StatusIcon }) => {
                            const status = backup[type as keyof Backup];
                            const {
                              icon: Icon,
                              color,
                              ptBR,
                              ptBRShort,
                            } = getStatusInfo(status);
                            return (
                              <div
                                key={type}
                                className={`flex items-center justify-between p-2 rounded-md ${color}`}
                              >
                                <div className="flex items-center space-x-2">
                                  <StatusIcon className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {label}
                                  </span>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 bg-white"
                                    >
                                      <Icon className="w-4 h-4" />
                                      <span className="text-xs whitespace-nowrap">
                                        {ptBRShort}
                                      </span>
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{ptBR}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
