"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { apiGetAllExercise } from "@/services/exercise.services";
import { apiGetAllUser } from "@/services/user.services";
import { PronunciationScoreType } from "@/types/pronunciation-score";
import { apiUpdatePronunciationScoren } from "@/services/pronunciation-score.services";
const formSchema = z.object({
  userId: z.string().min(1, {
    message: "User Id Id is required",
  }),
  exerciseId: z.string().min(6, {
    message: "Exercise Id is required",
  }),
  phonetic: z.string().min(1, {
    message: "Phonetic is required",
  }),
  userAudioUrl: z.string().min(1, {
    message: "User Audio Url is required",
  }),
  score: z.number().min(0, {
    message: "Score must be at least 0",
  }),
});
export const EditPronunciationScoreModal = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const { pronunciationScore } = data;
  const isModalOpen = isOpen && type === "editPronunciationScore";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      exerciseId: "",
      phonetic: "",
      userAudioUrl: "",
      score: 0,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await apiUpdatePronunciationScoren(pronunciationScore?._id, {
      ...values,
      userId: { _id: values.userId },
      exerciseId: { _id: values.exerciseId },
    });
    if (res) {
      onClose();
    }
    form.reset();
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const getAllExercise = async () => {
    const exercise = await apiGetAllExercise();
    if (exercise.data.success) {
      setExerciseData(exercise.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };

  const getAllUser = async () => {
    const user = await apiGetAllUser();
    if (user.data.success) {
      setUserData(user.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  useEffect(() => {
    if (pronunciationScore) {
      form.setValue("exerciseId", pronunciationScore.exerciseId?._id);
      form.setValue("userId", pronunciationScore.userId?._id);
      form.setValue("phonetic", pronunciationScore.phonetic);
      form.setValue("userAudioUrl", pronunciationScore.userAudioUrl);
      form.setValue("score", pronunciationScore.score);
    }
  }, [form, pronunciationScore]);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllExercise(), getAllUser()]);
    };
    fetchData();
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Pronunciation Score
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      User Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(userData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize"
                          >
                            {type?.email?.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exerciseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Exercise Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(exerciseData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize"
                          >
                            {type?.lessonId.content?.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phonetic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Phonetic
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter phonetic"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userAudioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      User Audio Url
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter user audio url"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Score
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a score" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object.values(PronunciationScoreType)
                          .filter((value) => typeof value === "number")
                          .map((value) => (
                            <SelectItem
                              key={value.toString()}
                              value={value.toString()} // Pass value as a string
                              className="capitalize"
                            >
                              {value.toString() + "%"}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={() => onClose()}
                className="text-black rounded-[4px]"
              >
                No, cancel
              </Button>
              <Button disabled={isLoading} variant="ghost">
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
