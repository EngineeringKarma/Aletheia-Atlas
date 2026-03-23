'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
    type: 'user' | 'ai';
    text: string;
    timestamp: Date;
};

export default function AletheiaPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState('');
    const [marks, setMarks] = useState('');
    const [assignments, setAssignments] = useState('');
    const [subjects, setSubjects] = useState('');
    const [hours, setHours] = useState('');
    const [question, setQuestion] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (messageText: string, label: string) => {
        if (!messageText) return;

        setLoading(true);
        setMessages(prev => [...prev, { type: 'user', text: label, timestamp: new Date() }]);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/aletheia/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: messageText,
                    chat_mode: 'free'
                }),
            });

            const data = await res.json();
            setMessages(prev => [...prev, { type: 'ai', text: data.content, timestamp: new Date() }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'ai',
                text: '⚠️ Error: Backend not running at http://127.0.0.1:8000\n\nPlease start your backend with: cd backend && python main.py',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            setQuestion('');
        }
    };

    const analyzeProductivity = () => {
        if (!attendance && !marks && !assignments) {
            alert('Please enter attendance, marks, and assignments');
            return;
        }
        sendMessage(
            `Analyze my productivity. Attendance: ${attendance}%, Marks: ${marks}%, Assignments: ${assignments}. Please provide detailed analysis with recommendations.`,
            `📊 Analyze → Attendance: ${attendance || '?'}%, Marks: ${marks || '?'}%, Assignments: ${assignments || '?'}`
        );
    };

    const generateStudyPlan = () => {
        if (!subjects || !hours) {
            alert('Please enter subjects and hours');
            return;
        }
        sendMessage(
            `Create a comprehensive study plan for ${subjects}. I can study ${hours} hours daily. Include schedule, breaks, and study techniques.`,
            `📅 Plan → ${subjects} (${hours} hrs/day)`
        );
    };

    const formatAIResponse = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (line.startsWith('•') || line.startsWith('-')) {
                return <li key={i} className="ml-4 mb-1 list-disc">{line.substring(1).trim()}</li>;
            }
            if (line.match(/^\d+\./)) {
                return <li key={i} className="ml-4 mb-1 list-decimal">{line}</li>;
            }
            if (line.includes('**')) {
                return <h4 key={i} className="font-semibold mt-2 mb-1">{line.replace(/\*\*/g, '')}</h4>;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="mb-1">{line}</p>;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">🤖 Aletheia AI Assistant</h1>
                    <p className="text-sm text-muted-foreground">Your intelligent productivity companion</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Productivity Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <span className="text-2xl">📊</span> Productivity Analyzer
                        </h3>
                        <p className="text-sm text-muted-foreground">Get detailed insights about your performance</p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Attendance %</label>
                            <input
                                type="number"
                                placeholder="e.g., 85"
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Marks %</label>
                            <input
                                type="number"
                                placeholder="e.g., 75"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Assignments Pending</label>
                            <input
                                type="number"
                                placeholder="e.g., 2"
                                value={assignments}
                                onChange={(e) => setAssignments(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <button
                            onClick={analyzeProductivity}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        >
                            Get Detailed Analysis →
                        </button>
                    </div>
                </div>

                {/* Study Planner Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <span className="text-2xl">📅</span> Smart Planner
                        </h3>
                        <p className="text-sm text-muted-foreground">Create personalized study plans with timelines</p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Subjects (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g., Math, Physics, English"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Hours per day</label>
                            <input
                                type="number"
                                placeholder="e.g., 4"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <button
                            onClick={generateStudyPlan}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        >
                            Generate Study Plan →
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Chat Row (Full Width Below) */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                        <span className="text-2xl">💬</span> Aletheia AI Assistant
                    </h3>
                    <p className="text-sm text-muted-foreground">Ask anything about your productivity, studies, or academic goals</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                    <div className="h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/30">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-24">
                                <div className="text-4xl mb-4">💡</div>
                                <p className="font-medium text-base">How can I help you excel today?</p>
                                <p className="text-sm opacity-70">Try clicking one of the tools above or ask me a question below.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-muted border rounded-tl-noneShadow-sm'}`}>
                                        <div className="text-sm leading-relaxed">
                                            {msg.type === 'ai' ? formatAIResponse(msg.text) : msg.text}
                                        </div>
                                        <p className="text-[10px] opacity-50 mt-2 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted border rounded-2xl rounded-tl-none px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl animate-pulse">🤖</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Type your message here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(question, `❓ ${question}`)}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <button
                            onClick={() => sendMessage(question, `❓ ${question}`)}
                            disabled={!question.trim() || loading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 active:scale-95"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}