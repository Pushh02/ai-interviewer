"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const topics = [
  { id: "reactjs", name: "React.js", icon: "⚛️" },
  { id: "nodejs", name: "Node.js", icon: "🟢" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "devops", name: "DevOps", icon: "🔄" },
  { id: "system-design", name: "System Design", icon: "🏗️" },
];

const expertiseLevels = [
  { id: "sde1", name: "SDE-1", description: "0-2 years experience" },
  { id: "sde2", name: "SDE-2", description: "2-5 years experience" },
  { id: "sde3", name: "SDE-3", description: "5+ years experience" },
];

const Page = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [name, setName] = useState("");

  const startInterviewMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/start-session`, {
        name,
        topic: selectedTopic,
        expertise: selectedExpertise,
        sessionId: Date.now().toString(),
      });
      return data;
    },
    onSuccess: (data) => {
      
      router.push(`/interview/${data.sessionId}`);
    },
    onError: (error) => {
      console.error("Failed to start interview:", error);
    }
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !selectedExpertise || !name.trim()) return;
    
    startInterviewMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 text-white/90">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">Interview Setup</h1>
        <p className="text-white/60 text-center mb-12">Choose your interview preferences below</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-white/80">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-white/40 text-lg backdrop-blur-sm transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Topics Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-white/80">Select Topic</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-xl border ${
                    selectedTopic === topic.id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/10 bg-white/5"
                  } hover:border-blue-500/50 transition-all duration-200 text-left`}
                >
                  <span className="text-2xl mb-2 block">{topic.icon}</span>
                  <span className="font-medium">{topic.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Expertise Level Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-white/80">Select Expertise Level</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expertiseLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setSelectedExpertise(level.id)}
                  className={`p-4 rounded-xl border ${
                    selectedExpertise === level.id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/10 bg-white/5"
                  } hover:border-blue-500/50 transition-all duration-200 text-left`}
                >
                  <span className="font-medium block">{level.name}</span>
                  <span className="text-white/60 text-sm">{level.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedTopic || !selectedExpertise || !name.trim() || startInterviewMutation.isPending}
            className="w-full py-4 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-lg transition-all duration-200 mt-8"
          >
            {startInterviewMutation.isPending ? "Starting Interview..." : "Start Interview"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;