"use client";
import React from "react";

import { useFormState } from "react-dom";
import { updateProfileAction } from "@/data/actions/profile-actions";
import { cn } from "@/lib/utils";

import { SubmitButton } from "@/components/custom/SubmitButton"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/StrapiErrors";

const INITIAL_STATE = {
    data: null,
    strapiErrors: null,
    message: null,
};

interface ProfileFormProps {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
}

export function ProfileForm({
    data,
    className,
}: {
    readonly data: ProfileFormProps;
    readonly className?: string;
}) {

    const updateUserWithId = updateProfileAction.bind(null, data.id);

    const [formState, formAction] = useFormState(
        updateUserWithId,
        INITIAL_STATE
    );

    return (
        <form action={formAction}
            className={cn("space-y-4", className)}>
            <div className="space-y-4 grid ">
                <div className="grid grid-cols-3 gap-4">
                    <Input
                        id="username"
                        name="username"
                        placeholder="Username"
                        defaultValue={data.username || ""}
                        disabled
                    />
                    <input type="hidden" name="id" value={data.id} /> 
                    <Input
                        id="email"
                        name="email"
                        placeholder="Email"
                        defaultValue={data.email || ""}
                        disabled
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        defaultValue={data.firstName || ""}
                    />
                    <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        defaultValue={data.lastName || ""}
                    />
                </div>
                <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Write your bio here..."
                    className="resize-none border rounded-md w-full h-[224px] p-2"
                    defaultValue={data.bio || ""}
                    required
                />
            </div>
            <div className="flex justify-end">
                <SubmitButton text="Update Profile" loadingText="Saving Profile" />
            </div>
            <StrapiErrors error={formState?.strapiErrors} />
        </form>
    );
}