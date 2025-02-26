'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const getSession = async (interviewId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${interviewId}`);
  return response.data;
}

export default function Home() {
  const { interviewId } = useParams();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: session } = useQuery({
    queryKey: ["session", interviewId],
    queryFn: () => getSession(interviewId as string),
  });
  
  useEffect(() => {
    scrollToBottom();
  }, [session]);
  
  const { mutate: sendResponse, isPending } = useMutation({
    mutationFn: (message: string) => sendMessage(message),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["session", interviewId] });
    }
  });

  const sendMessage = async (message: string) => {
    const InteractionCount = session?.length || 0;
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/${interviewId}`, { message, sessionId: interviewId, InteractionCount });
    return response.data;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {session?.map((item: any) => (
          <div key={item.questionNumber} className="space-y-4">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300 border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-white/90 font-medium">Interviewer</p>
              </div>
              <p className="text-white/80 text-lg">
                {item.question}
              </p>
            </div>
            {item.answer && <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-6 max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300 border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-white/90 font-medium">You</p>
              </div>
              <p className="text-white/80 text-lg">
                {item.answer}
              </p>
            </div>}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 backdrop-blur-lg bg-black/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendResponse(message);
                }
              }}
              placeholder="Type your message..."
              className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 text-white placeholder-white/40 text-lg backdrop-blur-sm transition-all duration-300"
            />
            <button disabled={message.length === 0 || isPending} onClick={() => sendResponse(message)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              {isPending ? "Sending..." : "Send"}
              <span className="ml-2">→</span>
            </button>
          </div>
          <div className="mt-2 text-white/40 text-sm text-center">
            Press Enter to send • ESC to cancel
          </div>
        </div>
      </div>
    </div>
  );
}
