"use client";
import { profileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type EditProfileProps = {
  user: {
    username: string;
    name: string;
    bio: string;
    location: string;
    portfolioWebsite: string;
  };
  mongoUserId: string;
  clerkId: string;
};
type ProfileForm = z.infer<typeof profileSchema>;

const formFields: ProfileForm = {
  name: "Full Name",
  username: "Username",
  location: "location",
  portfolioWebsite: "portfolio link",
  bio: "Bio",
};

const Profile = ({ clerkId, mongoUserId, user }: EditProfileProps) => {
  const path = usePathname();
  const router = useRouter();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...user,
    },
  });
  const onSubmit = async (values: ProfileForm) => {
    try {
      await updateUser({
        clerkId,
        path,
        updateData: {
          ...values,
        },
      });
      router.push(`/profile/${clerkId}`);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10">
        {Object.entries(formFields).map(([key, value]) => (
          <FormField
            key={key}
            control={form.control}
            name={key as keyof ProfileForm}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800 capitalize">
                  {value} <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  {key === "bio" ? (
                    <>
                      <Textarea
                        className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] resize-none border"
                        placeholder="Tell us about yourself"
                        rows={5}
                        {...field}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                        {...field}
                      />
                    </>
                  )}
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900 "
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
