import fs from "fs";

export const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}_${month}_${year}`;
};

export function extractDateFromFileName(fileNameWithExtension: string): Date {
  const fileName = fileNameWithExtension.split(".")[0];
  const dateParts = fileName.split("_");

  const day = Number(dateParts[dateParts.length - 3]);
  const month = Number(dateParts[dateParts.length - 2]);
  const year = Number(dateParts[dateParts.length - 1]);

  return new Date(2000 + year, month - 1, day);
}

export const getLatestFileByPrefix = (prefix: string, outputFolder: string) => {
  // Pega todos os arquivos com extensão .GBK
  const files = fs
    .readdirSync(outputFolder)
    .filter((file) => file.endsWith(`.GBK`) && file.startsWith(prefix));

  // Função para extrair a data do nome do arquivo
  const extractDateFromFileName = (fileName: string) => {
    const parts = fileName.split("_");
    const day = parts[1];
    const month = parts[2];
    const year = parts[3].slice(0, 2); // Considerando o formato YY

    // Retorna a data no formato YYYY-MM-DD
    return new Date(`20${year}-${month}-${day}`);
  };

  // Ordena os arquivos pela data, do mais recente ao mais antigo
  const sortedFiles = files.sort((a, b) => {
    const dateA = extractDateFromFileName(a);
    const dateB = extractDateFromFileName(b);
    return dateB.getTime() - dateA.getTime();
  });

  // Retorna o arquivo mais recente
  return sortedFiles.length > 0 ? sortedFiles[0] : null;
};
