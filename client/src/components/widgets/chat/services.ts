export const uploadFile = async ({
  fileData,
  message,
}: {
  fileData?: File[];
  message?: string;
}) => {
  const formData = new FormData();

  if (fileData) {
    const files = Array.from(fileData);
    files.forEach((file) => {
      formData.append(`files`, file);
    });
  }
  if (message) {
    formData.append(`message`, message);
  }

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_DOMAIN}/uploadfile`,
    {
      method: "POST",
      body: formData,
      headers: {
        ContentType: "multipart/form-data",
      },
    },
  );

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
};
