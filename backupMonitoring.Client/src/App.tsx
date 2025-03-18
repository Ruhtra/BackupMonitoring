"use client";

import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Database,
  LucideIcon,
  Upload,
  HardDrive,
  Calendar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetSeparacao } from "./Services/Querys/Reg/GetAll";
import { RegGetAllOutputDto } from "backupmonitoring.shared/src/Dtos/RegAllDto";

interface Backup
  extends Omit<
    RegGetAllOutputDto,
    "startBackup" | "finishBackup" | "createdAt"
  > {
  startBackup?: string;
  finishBackup?: string;
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
    startBackup:
      item.startBackup instanceof Date
        ? item.startBackup.toISOString()
        : item.startBackup,
    finishBackup:
      item.finishBackup instanceof Date
        ? item.finishBackup.toISOString()
        : item.finishBackup,
  }));

  const groupedBackups = backups.reduce((acc, backup) => {
    const date = format(parseISO(backup.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(backup);
    return acc;
  }, {} as Record<string, Backup[]>);

  const getStatusInfo = (status: string | null): StatusInfo => {
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
          color: "bg-gray-50 text-gray-400",
          ptBR: "Desconhecido",
          ptBRShort: "N/A",
        };
    }
  };

  const BackupItem = ({ backup }: { backup: Backup }) => (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3 min-w-[250px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800 truncate">
            {backup.dbName}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {format(parseISO(backup.createdAt), "HH:mm:ss")}
        </span>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>
            Início:{" "}
            {backup.startBackup
              ? format(parseISO(backup.startBackup), "HH:mm:ss")
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>
            Fim:{" "}
            {backup.finishBackup
              ? format(parseISO(backup.finishBackup), "HH:mm:ss")
              : "N/A"}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
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
          const status = backup[type as keyof Backup] as string | null;
          const { icon: Icon, color, ptBR, ptBRShort } = getStatusInfo(status);
          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 py-1 px-2 ${color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <Icon className="w-3 h-3" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {ptBRShort}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {label}: {ptBR}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex flex-col">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Monitoramento de Backup
        </h1>
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {Object.entries(groupedBackups).map(([date, dailyBackups]) => (
              <Card key={date} className="overflow-hidden shadow-lg bg-white">
                <CardHeader className="py-3 px-4 border-b border-gray-200 bg-gray-50">
                  <CardTitle className="text-lg text-gray-700 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    {format(parseISO(date), "d 'de' MMMM, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dailyBackups.map((backup) => (
                      <BackupItem key={backup.id} backup={backup} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
