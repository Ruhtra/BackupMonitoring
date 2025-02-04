"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackupFilesSection } from "./BackupFilesSection";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BackupTimeSection } from "./BackupTimeSection";
import { OutputFolderSection } from "./OutputFolderSection";
import { RemoteConfigSection } from "./RemoteConfigSection";
import { ActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GbakFilePathSection } from "./GbakFilePathSection";

//puxar da shared
export interface SettingsStore {
  backupConfig: {
    backupFiles: string[];
    dayToKeep: number;
    backupCron: string;
    outputFolder: string;
    gbakFilePath: string;

    sendFile: boolean;
    pathRemote?: string;
    sftpUser?: string;
    sftpHost?: string;
    sftpPort?: string;
    sshKeyPath?: string;
  };
  theme: string;
}

const formSchema = z.object({
  backupFiles: z.array(z.string()),
  backupTime: z.string(),
  outputFolder: z.string(),
  saveRemotely: z.boolean(),
  gbakFilePath: z.string().min(1),
  remoteConfig: z
    .object({
      pathRemote: z.string(),
      sftpUser: z.string(),
      sftpHost: z.string(),
      sftpPort: z.string(),
      sshKeyPath: z.string(),
    })
    .optional(),
});

type configType = z.infer<typeof formSchema>;

export function ConfigScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<configType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backupFiles: [],
      backupTime: "00 00 * * *",
      outputFolder: "",
      gbakFilePath: "",
      saveRemotely: false,
      remoteConfig: {
        pathRemote: "",
        sftpUser: "",
        sftpHost: "",
        sftpPort: "22",
        sshKeyPath: `/.ssh/id_rsa`,
      },
    },
  });

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer
        .getSettings()
        .then(({ backupConfig }: SettingsStore) => {
          console.log("conf");

          console.log(backupConfig);
          form.reset({
            backupFiles: backupConfig.backupFiles,
            backupTime: backupConfig.backupCron,
            outputFolder: backupConfig.outputFolder,
            saveRemotely: backupConfig.sendFile,
            gbakFilePath: backupConfig.gbakFilePath,
            remoteConfig: {
              pathRemote: backupConfig.pathRemote,
              sftpUser: backupConfig.sftpUser,
              sftpHost: backupConfig.sftpHost,
              sftpPort: backupConfig.sftpPort,
              sshKeyPath: backupConfig.sshKeyPath,
            },
          });
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error("Error fetching settings:", error);
          setIsLoading(false);
        });
    }
  }, []);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Configurações salvas:", values);

    window.ipcRenderer.setSettings({
      backupConfig: {
        backupCron: values.backupTime,
        backupFiles: values.backupFiles,
        dayToKeep: 3,
        outputFolder: values.outputFolder,
        gbakFilePath: values.gbakFilePath,
        sendFile: values.saveRemotely,
        pathRemote: values.remoteConfig?.pathRemote,
        sftpUser: values.remoteConfig?.sftpUser,
        sftpHost: values.remoteConfig?.sftpHost,
        sftpPort: values.remoteConfig?.sftpPort,
        sshKeyPath: values.remoteConfig?.sshKeyPath,
      },
      theme: "dark",
    });

    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-['Inter_var',sans-serif]">
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-700">
              Carregando configurações...
            </span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-['Inter_var',sans-serif]">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Configurações de Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BackupFilesSection form={form} />
              <GbakFilePathSection form={form} />
              <BackupTimeSection form={form} />
              <OutputFolderSection form={form} />
              <RemoteConfigSection form={form} />
              <ActionButtons />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
