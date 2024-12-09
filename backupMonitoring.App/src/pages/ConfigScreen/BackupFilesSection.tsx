"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Trash2, FilePlus } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

export function BackupFilesSection({ form }: { form: UseFormReturn<any> }) {
  const handleExplorer = async () => {
    try {
      const selectedFiles = await window.ipcRenderer.openFileDialog("file");
      if (selectedFiles && selectedFiles.length > 0) {
        form.setValue("backupFiles", [
          ...form.getValues("backupFiles"),
          ...selectedFiles,
        ]);
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivos:", error);
    }
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues("backupFiles");
    form.setValue(
      "backupFiles",
      currentFiles.filter((_, i) => i !== index)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormField
        control={form.control}
        name="backupFiles"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold mb-2 block">
              Arquivos para Backup
            </FormLabel>
            <div className="space-y-2 mb-2">
              {field.value.map((file: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span className="truncate flex-1">{file}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={handleExplorer} className="w-full">
              Adicionar Arquivo
              <FilePlus className="ml-2 h-4 w-4" />
            </Button>
          </FormItem>
        )}
      />
    </motion.div>
  );
}
