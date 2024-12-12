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
