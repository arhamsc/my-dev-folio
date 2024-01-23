"use client";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { questionsSchema } from "@/lib/validations";
import { KeyboardEvent, useEffect, useRef } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

// const type: string = "create";

type QuestionProps =
  | {
      mongoUserId: string;
      type: "create";
    }
  | {
      mongoUserId: string;
      type: "edit";
      questionDetails: {
        _id: string;
        title: string;
        content: string;
        tags: string[];
      };
    };

export function Question(props: QuestionProps) {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  // const [isSubmitting, setIsSubmitting] = useState(second)

  const form = useForm<z.infer<typeof questionsSchema>>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      title: props.type === "edit" ? props.questionDetails.title : "",
      explanation: props.type === "edit" ? props.questionDetails.content : "",
      tags: props.type === "edit" ? props.questionDetails.tags : [],
    },
  });

  useEffect(() => {
    if (props.type === "edit") {
      form.setValue("tags", props.questionDetails.tags);
    }
  }, []);

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          // No duplicates
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (values: z.infer<typeof questionsSchema>) => {
    try {
      if (props.type === "edit") {
        form.clearErrors("tags");
        await editQuestion({
          title: values.title,
          content: values.explanation,
          questionId: JSON.parse(props.questionDetails._id),
          path: pathname,
        });
        router.push(`/question/${JSON.parse(props.questionDetails._id)}`);
        return;
      }
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(props.mongoUserId),
        path: pathname,
      });
      router.push("/");
    } catch (error) {}
    console.log(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                {
                  "Be specific and imagine you're asking a question to another person."
                }
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {"Detailed explanation of your're problem"}{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    return (editorRef.current = editor);
                  }}
                  initialValue={field.value}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "codesample",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(value, editor) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 100 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {props.type !== "edit" && (
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      placeholder="Add tags..."
                      className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      disabled={field.disabled}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className={`subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize ${"cursor-pointer"}`}
                            onClick={() => handleTagRemove(tag, field)}>
                            {tag}{" "}
                            <Image
                              src="/assets/icons/close.svg"
                              width={12}
                              height={12}
                              alt="Close icon"
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />{" "}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add up to 3 tags to describe what your question is about. Hit
                  enter to add.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>{props.type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{props.type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default Question;
