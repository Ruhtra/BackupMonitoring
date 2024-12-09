import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Settings } from "lucide-react";
import { addDays, differenceInSeconds, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export function MainScreen() {
  //remover currentTime
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextBackup, setNextBackup] = useState<Date>(new Date());
  const [timeUntilBackup, setTimeUntilBackup] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer
        .getSettings()
        .then(({ backupConfig }: SettingsStore) => {
          // Assuming backupConfig.backupCron is in cron format and you want the hour and minute from it
          const [_seconds, minute, hour] = backupConfig.backupCron
            .split(" ")
            .map(Number);

          const now = new Date();
          const nextBackupTime = new Date();

          // Set the time based on backupConfig
          nextBackupTime.setHours(hour, minute, 0, 0);

          // Compare the calculated nextBackupTime with the current time (now)
          if (nextBackupTime < now) {
            // If nextBackupTime is earlier than now, set it to tomorrow
            nextBackupTime.setDate(now.getDate() + 1);
          } else {
            // If nextBackupTime is later or equal to now, set it to today
            nextBackupTime.setDate(now.getDate());
          }

          setNextBackup(nextBackupTime); // Update state with the next backup time
          console.log(nextBackupTime);

          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error("Error fetching settings:", error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const diffInSeconds = differenceInSeconds(nextBackup, now);
      if (diffInSeconds <= 0) {
        setNextBackup(addDays(nextBackup, 1));
        const update = differenceInSeconds(nextBackup, now);
        setTimeUntilBackup(update);
      } else {
        setTimeUntilBackup(diffInSeconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextBackup]);

  const formatTimeUntilBackup = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Backup Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Data de Hoje</p>
            <p className="text-xl font-bold text-gray-800">
              {format(currentTime, "d MMM yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50 shadow-inner">
            <p className="text-sm font-medium text-gray-500">Próximo Backup</p>
            <p className="text-xl font-bold text-gray-800">
              {format(nextBackup, "HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>
        {isLoading || !timeUntilBackup ? (
          <Skeleton>
            <div className="text-center p-4 rounded-lg bg-blue-50 shadow-inner">
              <p className="text-sm font-medium text-blue-600">Carregando...</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Clock className="w-6 h-6 text-blue-500 opacity-0" />
                <p className="text-2xl font-bold text-blue-700 opacity-0">e</p>
              </div>
            </div>
          </Skeleton>
        ) : (
          <div className="text-center p-4 rounded-lg bg-blue-50 shadow-inner">
            <p className="text-sm font-medium text-blue-600">
              Tempo até o Próximo Backup
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Clock className="w-6 h-6 text-blue-500" />
              <p className="text-2xl font-bold text-blue-700">
                {formatTimeUntilBackup(timeUntilBackup)}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Link to={"/config"}>
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
              <Settings className="w-5 h-5" />
              <span>Configurar</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
