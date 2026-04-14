"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editImage } from "./services";
import { useForm, useStore } from "@tanstack/react-form";
import { Field, FieldLabel } from "@/components/ui/field";

const IMAGES_BASE = `${import.meta.env.VITE_PUBLIC_DOMAIN}/static/images/`;

type ImageResult = {
  original: string;
  edited: string;
};

const defaultValues: { file: File | null } = {
  file: null,
};

export function EditImage() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<ImageResult | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (value.file) {
        mutation.mutate({ fileData: value.file });
      }
    },
  });

  const selectedFile = useStore(form.store, (state) => state.values.file);

  const mutation = useMutation({
    mutationFn: editImage,
    onSuccess: (data) => {
      const filenames = data.filenames;
      if (!filenames || filenames.length < 2) {
        return;
      }
      const [originalFile, editedFile] = filenames;
      const original = `${IMAGES_BASE}${originalFile}`;
      const edited = `${IMAGES_BASE}${editedFile}`;
      setResult({ original, edited });
      queryClient.invalidateQueries({ queryKey: ["images"] });
      form.reset();
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Редактирование изображения</CardTitle>
        <CardDescription>
          Загрузите изображение — сервер вернёт оригинал и отредактированную
          версию.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <form
            id="form-tanstack-image-edit"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            encType="multipart/form-data"
          >
            <form.Field
              name="file"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      ref={inputFileRef}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.handleChange(file);
                        }
                      }}
                    />
                  </Field>
                );
              }}
            />
          </form>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            form="form-tanstack-image-edit"
            disabled={!selectedFile || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Spinner className="size-4" />
                Отправка…
              </>
            ) : (
              "Отправить на сервер"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              inputFileRef.current && (inputFileRef.current.value = "");
            }}
            disabled={mutation.isPending}
          >
            Сбросить
          </Button>
        </div>

        {mutation.error && (
          <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
            {mutation.error.message}
          </div>
        )}

        {result && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Оригинал</p>
              <img
                src={result.original}
                alt="Оригинал"
                className="w-full rounded-lg border object-contain max-h-80 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Редактированное</p>
              <img
                src={result.edited}
                alt="Редактированное"
                className="w-full rounded-lg border object-contain max-h-80 bg-muted"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
