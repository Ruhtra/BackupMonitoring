"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function ActionButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex justify-between pt-4"
    >
      <Link to={".."}>
        <Button variant="outline" className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Button>
      </Link>
      <Button
        type="submit"
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
      >
        <Save className="w-5 h-5" />
        <span>Salvar</span>
      </Button>
    </motion.div>
  );
}
