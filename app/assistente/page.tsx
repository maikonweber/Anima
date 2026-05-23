"use client";

import { AssistantChatPage } from "@/components/assistant/AssistantChatPage";

export default function AssistentePage() {
  return (
    <div className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden px-3 pb-3 pt-1 sm:px-5 lg:px-10 lg:py-8">
      <AssistantChatPage />
    </div>
  );
}
