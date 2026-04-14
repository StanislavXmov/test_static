type ServerResponse = {
  filenames: string[];
  count: number;
};

export const editImage = async ({ fileData }: { fileData: File }) => {
  const formData = new FormData();
  formData.append("file", fileData);

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_DOMAIN}/images/edit`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json() as Promise<ServerResponse>;
};
