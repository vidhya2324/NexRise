"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import QuizResult from "./quiz-result";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setselectedQuiz] = useState(null);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-extrabold text-3xl md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review Your Past Quiz Performance</CardDescription>
          </div>

          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, i) => {
              return (
                <Card
                  key={assessment.id}
                  onClick={() => setselectedQuiz(assessment)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle>Quiz {i + 1}</CardTitle>
                    <CardDescription className="flex justify-between w-full">
                      <div>Score: {assessment.quizScore.toFixed(1)}%</div>

                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground ">
                      {assessment.improvementTip ||
                        "Perfect score! Keep up the great work 💪"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* dialog */}

      <Dialog open={!!selectedQuiz} onOpenChange={() => setselectedQuiz(null)}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <QuizResult
              result={selectedQuiz}
              onStartNew={() => router.push("/interview/mock")}
              hideStartNew
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
