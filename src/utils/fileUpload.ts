/**
 * Uploads bank statement file to the API
 * @param file - The file to upload
 * @param metadata - Additional metadata (kvkNummer, bedrijfsnaam, etc.)
 * @returns Promise<boolean> - Success status
 */
export const uploadBankStatement = async (
  file: File,
  metadata: { kvkNummer: string; bedrijfsnaam: string }
): Promise<boolean> => {
  // TODO: Implement actual API call
  // For now, simulate API call with delay
  console.log('Uploading bank statement:', file.name, metadata);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Bank statement uploaded successfully');
      resolve(true);
    }, 500);
  });
};
