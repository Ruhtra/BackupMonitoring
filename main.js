function extractDateFromFileName(fileNameWithExtension) {
  const fileName = fileNameWithExtension.split('.')[0]; // Remove a extensão
  const dateParts = fileName.split("_"); // Divide o nome do arquivo por "_"


  // Pega os últimos 3 elementos para dia, mês e ano
  const day = Number(dateParts[dateParts.length - 3]); // Dia (terceiro a partir do final)
  const month = Number(dateParts[dateParts.length - 2]); // Mês (segundo a partir do final)
  const year = Number(dateParts[dateParts.length - 1]); // Ano (último)

  return new Date(2000 + year, month - 1, day); // Ajusta para um objeto Date válido
}


console.log(extractDateFromFileName('VMN_OVO_20_10_24.GBK')); 