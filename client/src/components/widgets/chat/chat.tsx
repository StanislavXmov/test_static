"use client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "./services";

const formSchema = z.object({
  message: z.string(),
  // message: z.string().min(3, "Please provide at least 3 characters."),
  files: z.any(),
});

const defaultValues: { message: string; files: FileList | null } = {
  message: "",
  files: null,
};

export function Chat() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast(JSON.stringify(data));
    },
    onError: (error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      // if (value.files && value.files.length > 0) {
      //   mutation.mutate(value.files);
      // }

      if (files.length > 0 && value.message) {
        mutation.mutate({ fileData: files, message: value.message });
      } else if (files.length > 0) {
        mutation.mutate({ fileData: files });
      } else if (value.message) {
        mutation.mutate({ message: value.message });
      }
      // toast("You submitted the following values:", {
      //   description: (
      //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
      //       <code>{JSON.stringify(value, null, 2)}</code>
      //     </pre>
      //   ),
      //   position: "bottom-right",
      //   classNames: {
      //     content: "flex flex-col gap-2",
      //   },
      //   style: {
      //     "--border-radius": "calc(var(--radius)  + 4px)",
      //   } as React.CSSProperties,
      // });

      setFiles([]);
      formApi.reset();
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <Toaster />
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Enter information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-tanstack-textarea"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            encType="multipart/form-data"
          >
            <FieldGroup>
              <form.Field
                name="message"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="form-tanstack-textarea-about">
                        Message
                      </FieldLabel>
                      <Textarea
                        id="form-tanstack-textarea-about"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="enter message"
                        className="min-h-30"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="files"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor="form-tanstack-textarea-about">
                        File
                      </FieldLabel>
                      <Input
                        id="files"
                        ref={inputFileRef}
                        type="file"
                        multiple
                        name={field.name}
                        // value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          handleFileChange(e);
                          field.handleChange(e.target.files);
                        }}
                      />
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              className="flex items-center justify-between rounded-md border p-2"
                              key={index}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span>
                                  <img
                                    className="w-5 h-5"
                                    src={URL.createObjectURL(file)}
                                    alt="preview images"
                                  />
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                className="h-6 w-6"
                                onClick={() => removeFile(index)}
                                size="icon"
                                type="button"
                                variant="ghost"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-tanstack-textarea">
              Send
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
