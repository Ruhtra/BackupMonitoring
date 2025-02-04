"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

export function GbakFilePathSection({ form }: { form: UseFormReturn<any> }) {
  const handleSelectGbakFilPath = async () => {
    try {
      const selectedFile = await window.ipcRenderer.openFileDialog("any");
      if (selectedFile && selectedFile.length > 0) {
        form.setValue("gbakFilePath", selectedFile[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar gbak:", error);
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
          name="gbakFilePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="gbakFilePath">
                Caminho do arquivo GBAK
              </FormLabel>
              <div className="flex mt-1">
                <Input id="gbakFilePath" {...field} className="flex-1" />
                <Button
                  type="button"
                  onClick={handleSelectGbakFilPath}
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
    </>
  );
}
