'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AnimatedButton() {
  return (
    <Link href="/dashboard">
      <div className="animate-bounce">
        <Button size="lg" variant="secondary" className="font-bold h-11 mt-5">
          Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
}