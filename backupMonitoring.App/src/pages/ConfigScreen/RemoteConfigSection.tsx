"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

export function RemoteConfigSection({ form }: { form: UseFormReturn<any> }) {
  const handleSelectSshKey = async () => {
    try {
      const selectedFile = await window.ipcRenderer.openFileDialog("any");
      if (selectedFile && selectedFile.length > 0) {
        form.setValue("remoteConfig.sshKeyPath", selectedFile[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar chave SSH:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <FormField
          control={form.control}
          name="saveRemotely"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="saveRemotely"
              />
              <FormLabel htmlFor="saveRemotely">Salvar Remotamente</FormLabel>
            </FormItem>
          )}
        />
      </motion.div>

      {form.watch("saveRemotely") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="remoteConfig.pathRemote"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="pathRemote">Caminho Remoto</FormLabel>
                <Input id="pathRemote" {...field} className="mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remoteConfig.sftpUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sftpUser">Usuário SFTP</FormLabel>
                <Input id="sftpUser" {...field} className="mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remoteConfig.sftpHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sftpHost">Host SFTP</FormLabel>
                <Input id="sftpHost" {...field} className="mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remoteConfig.sftpPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sftpPort">Porta SFTP</FormLabel>
                <Input id="sftpPort" {...field} className="mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remoteConfig.sshKeyPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="sshKeyPath">Caminho da Chave SSH</FormLabel>
                <div className="flex mt-1">
                  <Input id="sshKeyPath" {...field} className="flex-1" />
                  <Button
                    onClick={handleSelectSshKey}
                    variant="outline"
                    className="ml-2"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </motion.div>
      )}
    </>
  );
}
